import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ILeaveServerUsecase } from "../interfaces/ILeaveServerUsecase";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { CannotRemoveOwnerError } from "../../../../domain/features/servers/errors/CannotRemoveOwnerError";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { AuditLogAction } from "../../../../shared/constants/auditLog.const";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";
@injectable()
export class LeaveServer implements ILeaveServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId: string): Promise<void> {
    this._logger.info("Leaving server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    // Check if user is a member
    const member = await this._memberRepo.findByServerAndUser(serverId, userId);
    if (!member) {
      throw new NotMemberError();
    }

    // Owner cannot leave without transferring ownership
    if (server.isOwner(userId)) {
      throw new CannotRemoveOwnerError();
    }

    await this._memberRepo.delete(member.id);
    await this._serverRepo.decrementMemberCount(serverId);

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: userId,
        action: AuditLogAction.MEMBER_LEFT,
        targetId: userId,
        metadata: {},
      }),
    );

    this._logger.info("User left server", { serverId, userId });
  }
}
