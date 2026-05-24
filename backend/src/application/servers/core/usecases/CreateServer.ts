import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { Server } from "../../../../domain/features/servers/entities/Server";
import { ServerMember } from "../../../../domain/features/servers/entities/ServerMember";
import { ICreateServerUsecase } from "../interfaces/ICreateServerUsecase";
import { CreateServerRequest } from "../dtos/requests/CreateServerRequest";
import { ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

@injectable()
export class CreateServer implements ICreateServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: CreateServerRequest): Promise<ServerResponse> {
    this._logger.info("Creating server", { userId, name: request.name });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const server = new Server({
      name: request.name,
      description: request.description,
      icon: request.icon,
      banner: request.banner,
      ownerId: userId,
      privacy: request.privacy,
      tags: request.tags,
    });

    const createdServer = await this._serverRepo.create(server);

    // Add owner as member
    const ownerMember = new ServerMember({
      serverId: createdServer.id,
      userId: userId,
      role: ServerMemberRole.OWNER,
    });

    await this._memberRepo.create(ownerMember);

    this._logger.info("Server created", { serverId: createdServer.id, userId });

    return ServerMapper.toResponse(createdServer);
  }
}
