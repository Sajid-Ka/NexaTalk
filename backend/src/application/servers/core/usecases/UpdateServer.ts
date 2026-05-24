import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IUpdateServerUsecase } from "../interfaces/IUpdateServerUsecase";
import { UpdateServerRequest } from "../dtos/requests/UpdateServerRequest";
import { ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";

@injectable()
export class UpdateServer implements IUpdateServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    serverId: string,
    userId: string,
    request: UpdateServerRequest,
  ): Promise<ServerResponse> {
    this._logger.info("Updating server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    // Only owner can update server
    if (!server.isOwner(userId)) {
      throw new InsufficientPermissionsError();
    }

    const updatedServer = await this._serverRepo.update(serverId, {
      name: request.name,
      description: request.description,
      icon: request.icon,
      banner: request.banner,
      privacy: request.privacy,
      tags: request.tags,
    });

    if (!updatedServer) {
      throw new ServerNotFoundError();
    }

    this._logger.info("Server updated", { serverId, userId });

    return ServerMapper.toResponse(updatedServer);
  }
}
