import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { CHANNELS_TYPES } from "../../../main/di/modules/channels/channels.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IChannelRepository } from "../../../domain/features/channels/repositories/IChannelRepository";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../domain/features/servers/errors/NotMemberError";
import { IGetChannelsUsecase } from "../interfaces/IGetChannelsUsecase";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";
import { ChannelMapper } from "../mappers/ChannelMapper";

@injectable()
export class GetChannels implements IGetChannelsUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(CHANNELS_TYPES.ChannelRepository)
    private readonly _channelRepo: IChannelRepository,
  ) {}

  async execute(serverId: string, currentUserId: string): Promise<ChannelResponse[]> {
    const server = await this._serverRepo.findById(serverId);
    if (!server) throw new ServerNotFoundError();

    const member = await this._memberRepo.findByServerAndUser(serverId, currentUserId);
    if (!member) throw new NotMemberError();

    const channels = await this._channelRepo.findByServer(serverId);
    return channels.map(ChannelMapper.toResponse);
  }
}
