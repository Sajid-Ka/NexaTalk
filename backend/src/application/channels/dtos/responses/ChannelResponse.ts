import { ChannelType } from "../../../../shared/constants/channel.const";

export interface ChannelResponse {
  id: string;
  serverId: string;
  name: string;
  type: ChannelType;
  createdBy: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
