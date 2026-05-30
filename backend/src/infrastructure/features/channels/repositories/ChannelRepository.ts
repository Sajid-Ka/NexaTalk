import { injectable } from "inversify";
import { Channel } from "../../../../domain/features/channels/entities/Channel";
import { IChannelRepository } from "../../../../domain/features/channels/repositories/IChannelRepository";
import { ChannelType } from "../../../../shared/constants/channel.const";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ChannelModel, IChannelPersistence } from "../database/ChannelModel";
import { ChannelPersistenceMapper } from "../mappers/ChannelMapper";

@injectable()
export class ChannelRepository
  extends BaseRepository<IChannelPersistence, Channel>
  implements IChannelRepository
{
  constructor() {
    super(ChannelModel, new ChannelPersistenceMapper());
  }

  async findByServer(serverId: string): Promise<Channel[]> {
    const docs = await this.model.find({ serverId }).sort({ type: 1, position: 1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByServerAndType(serverId: string, type: ChannelType): Promise<Channel[]> {
    const docs = await this.model.find({ serverId, type }).sort({ position: 1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async existsByName(serverId: string, name: string, type: ChannelType): Promise<boolean> {
    const count = await this.model.countDocuments({ serverId, type, name });
    return count > 0;
  }
}
