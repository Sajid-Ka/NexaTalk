import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";

export class RevokeSession {
    constructor(private refreshRepo : IRefreshTokenRepository) {}

    async execute(userId : string, sessionId : string) : Promise<void> {
        await this.refreshRepo.revokeById(sessionId,userId);
    }
}