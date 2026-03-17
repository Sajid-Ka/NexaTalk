import { inject, injectable } from "inversify";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IRevokeSessionUsecase } from "../interfaces/IRevokeSessionUsecase";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class RevokeSession implements IRevokeSessionUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, sessionId: string): Promise<void> {
    await this._refreshRepo.revokeById(sessionId, userId);
    this._logger.info("Session revoked", { userId, sessionId });
  }
}
