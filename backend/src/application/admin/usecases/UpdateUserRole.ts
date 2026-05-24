import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../domain/features/admin/repositories/IAdminUserRepository";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { IUpdateUserRoleUsecase } from "../interfaces/IUpdateUserRoleUsecase";
import { GlobalRole } from "../../../shared/constants/userRole.const";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class UpdateUserRole implements IUpdateUserRoleUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, role: GlobalRole): Promise<void> {
    this._logger.info("Update user role", { userId, role });

    const user = await this._repo.findById(userId);

    if (!user) {
      this._logger.warn("Update role failed - user not found", { userId });
      throw new NotFoundError("User not found");
    }

    await this._repo.update(userId, { globalRole: role });

    this._logger.info("User role updated", { userId, role });
  }
}
