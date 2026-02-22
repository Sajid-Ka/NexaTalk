import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";
import { SecureTokenGenerator } from "../../../infrastructure/auth/services/SecureTokenGenerator";
import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";
import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";

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

    if (storedSession.expiresAt.getTime() < new Date().getTime()) {
      await this.refreshRepo.deleteByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepo.findById(storedSession.userId);
    if (!user) {
      await this.refreshRepo.deleteByHash(tokenHash);
      throw new InvalidRefreshTokenError();
    }

    await this.refreshRepo.deleteByHash(tokenHash);

    const newRefreshRaw = this.tokenGenerator.generate();
    const newRefreshHash = this.tokenGenerator.hash(newRefreshRaw);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshRepo.save({
      userId: user.id,
      tokenHash: newRefreshHash,
      expiresAt,
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
