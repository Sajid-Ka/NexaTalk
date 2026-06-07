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
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";
import { AuditLogAction } from "../../../../shared/constants/auditLog.const";

@injectable()
export class UpdateServer implements IUpdateServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    serverId: string,
    userId: string,
    request: UpdateServerRequest,
  ): Promise<ServerResponse> {
    this._logger.info("Updating server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    let hasPermission = server.isOwner(userId);

    if (!hasPermission) {
      const member = await this._memberRepo.findByServerAndUser(serverId, userId);
      if (member && member.isAdmin()) {
        hasPermission = true;
      }
    }

    if (!hasPermission) throw new InsufficientPermissionsError();

    if (request.privacy && request.privacy !== server.privacy && !server.isOwner(userId)) {
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

    if (!updatedServer) throw new ServerNotFoundError();

    const logChanges = (action: AuditLogAction, metadata: Record<string, unknown>) => {
      return this._auditLogRepo.create(
        new ServerAuditLog({ serverId, actorId: userId, action, metadata }),
      );
    };

    if (request.name && server.name !== request.name)
      await logChanges(AuditLogAction.SERVER_NAME_UPDATED, { Old: server.name, New: request.name });

    if (request.description !== undefined && server.description !== request.description)
      await logChanges(AuditLogAction.SERVER_DESCRIPTION_UPDATED, {});

    if (request.privacy && server.privacy !== request.privacy)
      await logChanges(AuditLogAction.SERVER_PRIVACY_UPDATED, {
        Old: server.privacy,
        New: request.privacy,
      });

    if (request.icon && server.icon !== request.icon)
      await logChanges(AuditLogAction.SERVER_ICON_UPDATED, {});

    if (request.banner && server.banner !== request.banner)
      await logChanges(AuditLogAction.SERVER_BANNER_UPDATED, {});

    if (request.tags && JSON.stringify(server.tags) !== JSON.stringify(request.tags))
      await logChanges(AuditLogAction.SERVER_TAGS_UPDATED, {});

    this._logger.info("Server updated", { serverId, userId });

    return ServerMapper.toResponse(updatedServer);
  }
}
