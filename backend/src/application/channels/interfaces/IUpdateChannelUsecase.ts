import { UpdateChannelRequest } from "../dtos/requests/UpdateChannelRequest";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";

export interface IUpdateChannelUsecase {
  execute(
    serverId: string,
    channelId: string,
    currentUserId: string,
    request: UpdateChannelRequest,
  ): Promise<ChannelResponse>;
}
