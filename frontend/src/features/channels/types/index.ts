import type { ChannelType } from "../../../shared/constants/channel.const";

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: ChannelType;
  createdBy: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
}
