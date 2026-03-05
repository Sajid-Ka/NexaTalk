import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ILogoutAllDeviceUsecase } from "../interfaces/ILogoutAllDeviceUsecase";
import { injectable,inject } from "inversify";

@injectable()
export class LogoutAllDevice implements ILogoutAllDeviceUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo: IRefreshTokenRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this._refreshRepo.deleteAllByUser(userId);
  }
}
