import { Channel } from "../../../../domain/features/channels/entities/Channel";
import { IChannelPersistence } from "../models/ChannelModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ChannelPersistenceMapper implements IMapper<IChannelPersistence, Channel> {
  toDomain(doc: IChannelPersistence): Channel {
    return new Channel({
      id: doc._id.toString(),
      serverId: doc.serverId,
      name: doc.name,
      type: doc.type,
      createdBy: doc.createdBy,
      position: doc.position,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: Channel): Omit<IChannelPersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      name: entity.name,
      type: entity.type,
      createdBy: entity.createdBy,
      position: entity.position,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Channel>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.name !== undefined) update.name = partialDomain.name;
    if (partialDomain.position !== undefined) update.position = partialDomain.position;
    return update;
  }
}
