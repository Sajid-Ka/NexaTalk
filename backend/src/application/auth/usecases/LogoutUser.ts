import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ILogoutUserUsecase } from "../interfaces/ILogoutUserUsecase";
import { injectable,inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class LogoutUser implements ILogoutUserUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator: ITokenGenerator,
  ) {}

  async execute(refreshTokenRaw: string): Promise<void> {
    const tokenHash = this._tokenGenerator.hash(refreshTokenRaw);
    await this._refreshRepo.revokeByHash(tokenHash);
  }
}
