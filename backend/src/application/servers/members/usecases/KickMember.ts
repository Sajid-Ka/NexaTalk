import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerMembershipCleanupService } from "../interfaces/IServerMembershipCleanupService";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { CannotRemoveOwnerError } from "../../../../domain/features/servers/errors/CannotRemoveOwnerError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { IKickMemberUsecase } from "../interfaces/IKickMemberUsecase";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { AuditLogAction } from "../../../../shared/constants/auditLog.const";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";

@injectable()
export class KickMember implements IKickMemberUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(SERVERS_TYPES.ServerMembershipCleanupService)
    private readonly _membershipCleanupService: IServerMembershipCleanupService,
  ) {}

  async execute(serverId: string, currentUserId: string, targetUserId: string): Promise<void> {
    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const targetMember = await this._memberRepo.findByServerAndUser(serverId, targetUserId);

    if (!targetMember) {
      throw new NotMemberError();
    }

    if (targetMember.role === ServerMemberRole.OWNER) {
      throw new CannotRemoveOwnerError();
    }

    const isOwner = currentMember.role === ServerMemberRole.OWNER;

    const isAdmin = currentMember.role === ServerMemberRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new InsufficientPermissionsError();
    }

    if (isAdmin && targetMember.role !== ServerMemberRole.MEMBER) {
      throw new InsufficientPermissionsError();
    }

    await this._membershipCleanupService.removeMemberAndDecrementCount(serverId, targetUserId);

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: currentUserId,
        action: AuditLogAction.MEMBER_KICKED,
        targetId: targetUserId,
        metadata: {},
      }),
    );
  }
}
