import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";
import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";
import { IRefreshSessionUsecase } from "../interfaces/IRefreshSessionUsecase";
import { ILogger } from "../../../domain/common/interfaces/ILogger";

const REFRESH_TTL_DAYS = 7;

export class RefreshSession implements IRefreshSessionUsecase {
  constructor(
    private refreshRepo: IRefreshTokenRepository,
    private tokenService: ITokenService,
    private tokenGenerator: ITokenGenerator,
    private userRepo: IUserRepository,
    private logger: ILogger,
  ) { }

  async execute(refreshTokenRaw: string): Promise<RefreshTokenResponse> {
    const tokenHash = this.tokenGenerator.hash(refreshTokenRaw);
    const storedSession = await this.refreshRepo.findByHash(tokenHash);

    if (!storedSession) throw new InvalidRefreshTokenError();

    if (storedSession.revoked) {
      await this.refreshRepo.deleteAllByUser(storedSession.userId);

      this.logger.warn("Refresh token reuse detected", { userId: storedSession.userId });

      throw new InvalidRefreshTokenError();
    }

    if (storedSession.expiresAt.getTime() <= Date.now()) {
      await this.refreshRepo.revokeByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepo.findById(storedSession.userId);
    if (!user) {
      await this.refreshRepo.revokeByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    await this.refreshRepo.revokeByHash(tokenHash);

    const newRefreshRaw = this.tokenGenerator.generate();
    const newRefreshHash = this.tokenGenerator.hash(newRefreshRaw);

    const newExpires = new Date();
    newExpires.setDate(newExpires.getDate() + REFRESH_TTL_DAYS);

    await this.refreshRepo.save({
      userId: user.id,
      tokenHash: newRefreshHash,
      expiresAt: newExpires,
      ipAddress: storedSession.ipAddress,
      userAgent: storedSession.userAgent,
    });

    const accessToken = this.tokenService.generateAccessToken(user.id, user.globalRole);

    return {
      accessToken,
      refreshToken: newRefreshRaw,
    };
  }
}
