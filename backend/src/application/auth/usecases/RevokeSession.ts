import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IRevokeSessionUsecase } from "../interfaces/IRevokeSessionUsecase";

export class RevokeSession implements IRevokeSessionUsecase {
    constructor(private refreshRepo : IRefreshTokenRepository) {}

    async execute(userId : string, sessionId : string) : Promise<void> {
        await this.refreshRepo.revokeById(sessionId,userId);
    }
}