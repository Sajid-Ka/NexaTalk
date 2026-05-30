import { CreateChannelRequest } from "../dtos/requests/CreateChannelRequest";
import { ChannelResponse } from "../dtos/responses/ChannelResponse";

export interface ICreateChannelUsecase {
  execute(
    serverId: string,
    currentUserId: string,
    request: CreateChannelRequest,
  ): Promise<ChannelResponse>;
}
