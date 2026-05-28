import { inject, injectable } from "inversify";
import { IListUsersUsecase } from "../interfaces/IListUsersUsecase";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { PaginatedUsersResponse } from "../dtos/response/PaginatedUsersResponse";
import { ListUsersRequestQuery } from "../dtos/request/ListUsersRequestQuery";
import { AdminUserMapper } from "../mappers/AdminUserMapper";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";

@injectable()
export class ListUsers implements IListUsersUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(query: ListUsersRequestQuery): Promise<PaginatedUsersResponse> {
    this._logger.info("Admin listing users", { query });

    const result = await this._repo.findUsers(query);

    return {
      users: AdminUserMapper.toList(result.users),
      page: result.page ?? 1,
      limit: result.limit ?? 10,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }
}
