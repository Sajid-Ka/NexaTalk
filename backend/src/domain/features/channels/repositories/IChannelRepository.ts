import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Channel } from "../entities/Channel";
import { ChannelType } from "../../../../shared/constants/channel.const";

export interface IChannelRepository extends IBaseRepository<Channel> {
  findByServer(serverId: string): Promise<Channel[]>;
  findByServerAndType(serverId: string, type: ChannelType): Promise<Channel[]>;
  existsByName(serverId: string, name: string, type: ChannelType): Promise<boolean>;
}
