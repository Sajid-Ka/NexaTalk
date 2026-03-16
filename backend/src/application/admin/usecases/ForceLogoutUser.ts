import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../domain/admin/repositories/IAdminUserRepository";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ForbiddenError } from "../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IForceLogoutUserUsecase } from "../interface/IForceLogoutUserUsecase";

@injectable()
export class ForceLogoutUser implements IForceLogoutUserUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
  ) {}

  async execute(userId: string, adminId: string): Promise<void> {
    this._logger.info("Force logout user attempt", { userId, adminId });

    if (userId === adminId) {
      this._logger.warn("Admin attempted to force logout themselves", { adminId });
      throw new ForbiddenError("You cannot force logout yourself");
    }

    const user = await this._repo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this._repo.update(userId, {
      sessionVersion: (user.sessionVersion || 1) + 1,
    });

    // Revoke all refresh tokens to prevent automatic re-authentication
    await this._refreshRepo.deleteAllByUser(userId);

    await this._tokenService.revokeUserTokens?.(userId);

    this._logger.info("User force logged out successfully", { userId, adminId });
  }
}
