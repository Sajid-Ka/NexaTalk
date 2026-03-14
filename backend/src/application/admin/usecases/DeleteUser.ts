import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../domain/admin/repositories/IAdminUserRepository";
import { IDeleteUserUsecase } from "../interface/IDeleteUserUsecase";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class DeleteUser implements IDeleteUserUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    this._logger.warn("Delete user attempt", { userId });

    await this._repo.delete(userId);

    this._logger.warn("User deleted", { userId });
  }
}
