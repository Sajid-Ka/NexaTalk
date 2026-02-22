import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";
import { SecureTokenGenerator } from "../../../infrastructure/auth/services/SecureTokenGenerator";
import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";

export class RefreshSession {
    constructor(
        private refreshRepo: IRefreshTokenRepository,
        private tokenService: ITokenService,
        private tokenGenerator: SecureTokenGenerator,
        private userRepo: IUserRepository
    ) { }

    async execute(refreshTokenRaw: string) {
        const tokenHash = this.tokenGenerator.hash(refreshTokenRaw);
        const stored = await this.refreshRepo.findByHash(tokenHash);

        if (!stored) throw new InvalidRefreshTokenError();

        if (stored.expiresAt < new Date()) {
            await this.refreshRepo.deleteByHash(tokenHash);
            throw new InvalidRefreshTokenError();
        }

        const user = await this.userRepo.findById(stored.userId);
        if (!user) throw new InvalidRefreshTokenError();

        await this.refreshRepo.deleteByHash(tokenHash);

        const newRefreshRaw = this.tokenGenerator.generate();
        const newRefreshHash = this.tokenGenerator.hash(newRefreshRaw);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.refreshRepo.save({
            userId: stored.userId,
            tokenHash: newRefreshHash,
            expiresAt,
            ipAddress: stored.ipAddress,
            userAgent: stored.userAgent,
        });

        const accessToken = this.tokenService.generateAccessToken(user.id, user.globalRole);

        return {
            accessToken,
            refreshToken: newRefreshRaw,
        };
    }
}
