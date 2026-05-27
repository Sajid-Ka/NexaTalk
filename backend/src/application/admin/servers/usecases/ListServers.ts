import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IAdminServerRepository } from "../../../../domain/features/admin/repositories/IAdminServerRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IListServersUsecase } from "../interfaces/IListServersUsecase";
import { ListServersRequestQuery } from "../dtos/requests/ListServersRequestQuery";
import { PaginatedServersResponse } from "../dtos/responses/PaginatedServersResponse";
import { AdminServerMapper } from "../mappers/AdminServerMapper";

@injectable()
export class ListServers implements IListServersUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminServerRepository)
    private readonly _serverRepo: IAdminServerRepository,

    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(query: ListServersRequestQuery): Promise<PaginatedServersResponse> {
    const result = await this._serverRepo.findServers(query);

    const servers = await Promise.all(
      result.servers.map(async (server) => {
        const owner = await this._userRepo.findById(server.ownerId);
        return AdminServerMapper.toResponse(server, owner);
      }),
    );

    return {
      servers,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }
}