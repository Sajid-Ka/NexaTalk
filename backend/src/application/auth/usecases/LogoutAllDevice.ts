import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ILogoutAllDeviceUsecase } from "../interfaces/ILogoutAllDeviceUsecase";
import { injectable, inject } from "inversify";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class LogoutAllDevice implements ILogoutAllDeviceUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._refreshRepo.deleteAllByUser(userId);
    this._logger.warn("Logout all devices", { userId });
  }
}
