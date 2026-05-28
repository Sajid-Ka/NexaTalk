import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { IUnblockUserUsecase } from "../interfaces/IUnblockUserUsecase";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";

@injectable()
export class UnblockUser implements IUnblockUserUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, adminId: string): Promise<void> {
    this._logger.info("Unblock user attempt", { userId });

    if (userId === adminId) {
      this._logger.warn("Admin attempted to unblock themselves", { adminId });
      throw new ForbiddenError("You cannot unblock your own account");
    }

    const user = await this._repo.findById(userId);

    if (!user) {
      this._logger.warn("Unblock user failed - user not found", { userId });
      throw new NotFoundError("User not found");
    }

    await this._repo.update(userId, {
      accountStatus: UserAccountStatus.ACTIVE,
      sessionVersion: (user.sessionVersion || 1) + 1,
    });

    this._logger.info("User unblocked", { userId });
  }
}
