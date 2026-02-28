import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ILogoutUserUsecase } from "../interfaces/ILogoutUserUsecase";

export class LogoutUser implements ILogoutUserUsecase {
  constructor(
    private refreshRepo: IRefreshTokenRepository,
    private tokenGenerator: ITokenGenerator,
  ) { }

  async execute(refreshTokenRaw: string): Promise<void> {
    const tokenHash = this.tokenGenerator.hash(refreshTokenRaw);
    await this.refreshRepo.revokeByHash(tokenHash);
  }
}
