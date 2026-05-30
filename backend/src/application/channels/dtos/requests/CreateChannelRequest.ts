import { ChannelType } from "../../../../shared/constants/channel.const";

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
}
