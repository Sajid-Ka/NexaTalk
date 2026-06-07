import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { CHANNELS_TYPES } from "../../../main/di/modules/channels/channels.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IChannelRepository } from "../../../domain/features/channels/repositories/IChannelRepository";
import { IServerAuditLogRepository } from "../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { ServerAuditLog } from "../../../domain/features/servers/entities/ServerAuditLog";
import { AuditLogAction } from "../../../shared/constants/auditLog.const";
import { Channel } from "../../../domain/features/channels/entities/Channel";
import { ServerMemberRole } from "../../../shared/constants/server.const";
import { ChannelType } from "../../../shared/constants/channel.const";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ICreateChannelUsecase } from "../interfaces/ICreateChannelUsecase";
import { CreateChannelRequest } from "../dtos/requests/CreateChannelRequest";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";
import { ChannelMapper } from "../mappers/ChannelMapper";

@injectable()
export class CreateChannel implements ICreateChannelUsecase {
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
    currentUserId: string,
    request: CreateChannelRequest,
  ): Promise<ChannelResponse> {
    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    const member = await this._memberRepo.findByServerAndUser(serverId, currentUserId);
    if (!member) throw new NotMemberError();

    const canManage =
      member.role === ServerMemberRole.OWNER || member.role === ServerMemberRole.ADMIN;
    if (!canManage) throw new InsufficientPermissionsError();

    const name = request.name.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name) throw new BadRequestError("Channel name is required");

    const type = request.type;
    if (type !== ChannelType.TEXT && type !== ChannelType.VOICE)
      throw new BadRequestError("Invalid channel type");

    const exists = await this._channelRepo.existsByName(serverId, name, type);
    if (exists) throw new BadRequestError("A channel with this name already exists");

    const existing = await this._channelRepo.findByServerAndType(serverId, type);
    const channel = new Channel({
      serverId,
      name,
      type,
      createdBy: currentUserId,
      position: existing.length,
    });

    const created = await this._channelRepo.create(channel);

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: currentUserId,
        action: AuditLogAction.CHANNEL_CREATED,
        targetId: created.id,
        metadata: { targetName: `#${created.name}`, "Channel Type": created.type },
      }),
    );

    return ChannelMapper.toResponse(created);
  }
}
