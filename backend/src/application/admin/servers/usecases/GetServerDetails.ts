import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IAdminServerRepository } from "../../../../domain/features/admin/repositories/IAdminServerRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { IGetServerDetailsUsecase } from "../interfaces/IGetServerDetailsUsecase";
import { AdminServerResponse } from "../dtos/responses/AdminServerResponse";
import { AdminServerMapper } from "../mappers/AdminServerMapper";

@injectable()
export class GetServerDetails implements IGetServerDetailsUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminServerRepository)
    private readonly _serverRepo: IAdminServerRepository,

    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(serverId: string): Promise<AdminServerResponse> {
    const server = await this._serverRepo.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server not found");
    }

    const owner = await this._userRepo.findById(server.ownerId);

    return AdminServerMapper.toResponse(server, owner);
  }
}