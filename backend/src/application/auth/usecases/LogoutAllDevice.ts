import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ILogoutAllDeviceUsecase } from "../interfaces/ILogoutAllDeviceUsecase";

export class LogoutAllDevice implements ILogoutAllDeviceUsecase {
  constructor(private refreshRepo: IRefreshTokenRepository) {}

  async execute(userId: string): Promise<void> {
    await this.refreshRepo.deleteAllByUser(userId);
  }
}
