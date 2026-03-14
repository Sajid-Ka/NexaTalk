import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { ILogoutUserUsecase } from "../interfaces/ILogoutUserUsecase";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class LogoutUser implements ILogoutUserUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(refreshTokenRaw: string): Promise<void> {
    const tokenHash = this._tokenGenerator.hash(refreshTokenRaw);
    await this._refreshRepo.revokeByHash(tokenHash);
    this._logger.info("User logout", { tokenHash });
  }
}
