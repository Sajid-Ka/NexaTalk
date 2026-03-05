import { inject, injectable } from "inversify";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IRevokeSessionUsecase } from "../interfaces/IRevokeSessionUsecase";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class RevokeSession implements IRevokeSessionUsecase {
    constructor(
        @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo : IRefreshTokenRepository
    ) {}

    async execute(userId : string, sessionId : string) : Promise<void> {
        await this._refreshRepo.revokeById(sessionId,userId);
    }
}