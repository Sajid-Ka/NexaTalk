import { Channel } from "../../../domain/features/channels/entities/Channel";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";

export class ChannelMapper {
  static toResponse(channel: Channel): ChannelResponse {
    return {
      id: channel.id,
      serverId: channel.serverId,
      name: channel.name,
      type: channel.type,
      createdBy: channel.createdBy,
      position: channel.position,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }
}
