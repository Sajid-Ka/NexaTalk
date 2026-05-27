import { injectable, inject } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { IGetUserDetailsUsecase } from "../interfaces/IGetUserDetailsUsecase";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { AdminUserResponse } from "../dtos/response/AdminUserResponse";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";

@injectable()
export class GetUserDetails implements IGetUserDetailsUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) { }

  async execute(userId: string): Promise<AdminUserResponse> {
    this._logger.info("Get user details", { userId });

    const user = await this._repo.findById(userId);

    if (!user) {
      this._logger.warn("User details fetch failed", { userId });
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.globalRole,
      status: user.accountStatus,
      createdAt: user.createdAt,
    };
  }
}
