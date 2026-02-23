import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";
import { SecureTokenGenerator } from "../../../infrastructure/auth/services/SecureTokenGenerator";
import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";
import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";

const REFRESH_TTL_DAYS = 7;

export class RefreshSession {
  constructor(
    private refreshRepo: IRefreshTokenRepository,
    private tokenService: ITokenService,
    private tokenGenerator: SecureTokenGenerator,
    private userRepo: IUserRepository,
  ) {}

  async execute(refreshTokenRaw: string): Promise<RefreshTokenResponse> {
    const tokenHash = this.tokenGenerator.hash(refreshTokenRaw);
    const storedSession = await this.refreshRepo.findByHash(tokenHash);

    if (!storedSession) throw new InvalidRefreshTokenError();

    if (storedSession.revoked) {
      await this.refreshRepo.deleteAllByUser(storedSession.userId);
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
