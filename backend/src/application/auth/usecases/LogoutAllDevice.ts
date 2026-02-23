import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";

export class LogoutAllDevice {
  constructor(private refreshRepo: IRefreshTokenRepository) {}

  async execute(userId: string): Promise<void> {
    await this.refreshRepo.deleteAllByUser(userId);
  }
}
