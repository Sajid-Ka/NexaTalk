import { ChannelResponse } from "../dtos/responses/ChannelResponse";

export interface IGetChannelsUsecase {
  execute(serverId: string, currentUserId: string): Promise<ChannelResponse[]>;
}
