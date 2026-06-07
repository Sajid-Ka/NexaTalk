import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { IGetServerAuditLogsUsecase } from "../interfaces/IGetServerAuditLogsUsecase";
import { ServerAuditLogResponse } from "../dtos/responses/ServerAuditLogResponse";

@injectable()
export class GetServerAuditLogs implements IGetServerAuditLogsUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    serverId: string,
    currentUserId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ServerAuditLogResponse[]> {
    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);
    if (!currentMember) throw new NotMemberError();

    const canViewAuditLogs =
      currentMember.role === ServerMemberRole.OWNER ||
      currentMember.role === ServerMemberRole.ADMIN;

    if (!canViewAuditLogs) throw new InsufficientPermissionsError();

    const logs = await this._auditLogRepo.findByServer(serverId, limit, offset);

    return Promise.all(
      logs.map(async (log) => {
        const actor = await this._userRepo.findById(log.actorId);

        let targetUsername: string | null = null;

        if (log.targetId && !log.action.startsWith("CHANNEL")) {
          const target = await this._userRepo.findById(log.targetId);
          targetUsername = target?.username ?? null;
        } else if (log.targetId && log.action.startsWith("CHANNEL")) {
          targetUsername = (log.metadata?.targetName as string) ?? log.targetId;
        }

        return {
          id: log.id,
          serverId: log.serverId,
          actorId: log.actorId,
          actorUsername: actor?.username ?? "Unknown User",
          action: log.action,
          targetId: log.targetId,
          targetUsername,
          details: log.metadata ?? {},
          createdAt: log.createdAt,
        };
      }),
    );
  }
}
