import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { CHANNELS_TYPES } from "../../../main/di/modules/channels/channels.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IChannelRepository } from "../../../domain/features/channels/repositories/IChannelRepository";
import { IServerAuditLogRepository } from "../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { ServerAuditLog } from "../../../domain/features/servers/entities/ServerAuditLog";
import { AuditLogAction } from "../../../shared/constants/auditLog.const";
import { ServerMemberRole } from "../../../shared/constants/server.const";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../domain/features/servers/errors/InsufficientPermissionsError";
import { IDeleteChannelUsecase } from "../interfaces/IDeleteChannelUsecase";

@injectable()
export class DeleteChannel implements IDeleteChannelUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(CHANNELS_TYPES.ChannelRepository) private readonly _channelRepo: IChannelRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
  ) {}

  async execute(serverId: string, channelId: string, currentUserId: string): Promise<void> {
    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    const member = await this._memberRepo.findByServerAndUser(serverId, currentUserId);
    if (!member) throw new NotMemberError();

    const canManage =
      member.role === ServerMemberRole.OWNER || member.role === ServerMemberRole.ADMIN;
    if (!canManage) throw new InsufficientPermissionsError();

    const channel = await this._channelRepo.findById(channelId);
    if (!channel || channel.serverId !== serverId) throw new NotFoundError("Channel not found");

    await this._channelRepo.deleteChannel(channelId);

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: currentUserId,
        action: AuditLogAction.CHANNEL_DELETED,
        targetId: channelId,
        metadata: { targetName: `#${channel.name}` },
      }),
    );
  }
}
