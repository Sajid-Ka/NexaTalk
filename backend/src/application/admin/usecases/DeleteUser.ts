import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../domain/features/admin/repositories/IAdminUserRepository";
import { IDeleteUserUsecase } from "../interface/IDeleteUserUsecase";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ForbiddenError } from "../../../domain/core/errors/ForbiddenError";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";

@injectable()
export class DeleteUser implements IDeleteUserUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
  ) {}

  async execute(userId: string, adminId: string): Promise<void> {
    this._logger.warn("Delete user attempt", { userId });

    if (userId === adminId) {
      this._logger.warn("Admin attempted to delete themselves", { adminId });
      throw new ForbiddenError("You cannot delete your own account");
    }

    const user = await this._repo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this._repo.update(userId, {
      accountStatus: UserAccountStatus.DELETED,
      deletedAt: new Date(),
    });

    await this._tokenService.revokeUserTokens?.(userId);

    this._logger.warn("User deleted", { userId, adminId });
  }
}
