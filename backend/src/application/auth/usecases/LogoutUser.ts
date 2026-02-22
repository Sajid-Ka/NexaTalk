import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { SecureTokenGenerator } from "../../../infrastructure/auth/services/SecureTokenGenerator";

export class LogoutUser {
    constructor(
        private refreshRepo: IRefreshTokenRepository,
        private tokenGenerator: SecureTokenGenerator
    ) { }

    async execute(refreshTokenRaw: string) {
        const tokenHash = this.tokenGenerator.hash(refreshTokenRaw);
        await this.refreshRepo.deleteByHash(tokenHash);
    }
}
