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
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../domain/features/servers/errors/InsufficientPermissionsError";
import { IUpdateChannelUsecase } from "../interfaces/IUpdateChannelUsecase";
import { UpdateChannelRequest } from "../dtos/requests/UpdateChannelRequest";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";
import { ChannelMapper } from "../mappers/ChannelMapper";

@injectable()
export class UpdateChannel implements IUpdateChannelUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(CHANNELS_TYPES.ChannelRepository) private readonly _channelRepo: IChannelRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
  ) {}

  async execute(
    serverId: string,
    channelId: string,
    currentUserId: string,
    request: UpdateChannelRequest,
  ): Promise<ChannelResponse> {
    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    const member = await this._memberRepo.findByServerAndUser(serverId, currentUserId);
    if (!member) throw new NotMemberError();

    const canManage =
      member.role === ServerMemberRole.OWNER || member.role === ServerMemberRole.ADMIN;
    if (!canManage) throw new InsufficientPermissionsError();

    const channel = await this._channelRepo.findById(channelId);
    if (!channel || channel.serverId !== serverId) throw new NotFoundError("Channel not found");

    const name = request.name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) throw new BadRequestError("Channel name is required");

    const exists = await this._channelRepo.existsByName(serverId, name, channel.type);
    if (exists && channel.name !== name)
      throw new BadRequestError("A channel with this name already exists");

    const updated = await this._channelRepo.updateName(channelId, name);
    if (!updated) throw new NotFoundError("Channel not found");

    if (channel.name !== name) {
      await this._auditLogRepo.create(
        new ServerAuditLog({
          serverId,
          actorId: currentUserId,
          action: AuditLogAction.CHANNEL_RENAMED,
          targetId: channelId,
          metadata: { targetName: `#${name}`, "Old Name": channel.name, "New Name": name },
        }),
      );
    }

    return ChannelMapper.toResponse(updated);
  }
}
