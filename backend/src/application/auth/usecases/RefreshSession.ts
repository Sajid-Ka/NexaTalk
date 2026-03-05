import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";
import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";
import { IRefreshSessionUsecase } from "../interfaces/IRefreshSessionUsecase";
import { ILogger } from "../../../domain/common/interfaces/ILogger";
import { injectable,inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

const REFRESH_TTL_DAYS = 7;

@injectable()
export class RefreshSession implements IRefreshSessionUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenService) private _tokenService: ITokenService,
    @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(AUTH_TYPES.Logger) private _logger: ILogger,
  ) {}

  async execute(refreshTokenRaw: string): Promise<RefreshTokenResponse> {
    const tokenHash = this._tokenGenerator.hash(refreshTokenRaw);
    const storedSession = await this._refreshRepo.findByHash(tokenHash);

    if (!storedSession) throw new InvalidRefreshTokenError();

    if (storedSession.revoked) {
      await this._refreshRepo.deleteAllByUser(storedSession.userId);

      this._logger.warn("Refresh token reuse detected", { userId: storedSession.userId });

      throw new InvalidRefreshTokenError();
    }

    if (storedSession.expiresAt.getTime() <= Date.now()) {
      await this._refreshRepo.revokeByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    const user = await this._userRepo.findById(storedSession.userId);
    if (!user) {
      await this._refreshRepo.revokeByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    await this._refreshRepo.revokeByHash(tokenHash);

    const newRefreshRaw = this._tokenGenerator.generate();
    const newRefreshHash = this._tokenGenerator.hash(newRefreshRaw);

    const newExpires = new Date();
    newExpires.setDate(newExpires.getDate() + REFRESH_TTL_DAYS);

    await this._refreshRepo.save({
      userId: user.id,
      tokenHash: newRefreshHash,
      expiresAt: newExpires,
      ipAddress: storedSession.ipAddress,
      userAgent: storedSession.userAgent,
    });

    const accessToken = this._tokenService.generateAccessToken(user.id, user.globalRole);

    return {
      accessToken,
      refreshToken: newRefreshRaw,
    };
  }
}
