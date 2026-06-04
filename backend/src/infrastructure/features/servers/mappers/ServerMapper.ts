import { Server } from "../../../../domain/features/servers/entities/Server";
import { IServerPersistence } from "../models/ServerModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerPersistenceMapper implements IMapper<IServerPersistence, Server> {
  toDomain(doc: IServerPersistence): Server {
    return new Server({
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      icon: doc.icon,
      banner: doc.banner,
      ownerId: doc.ownerId,
      privacy: doc.privacy,
      isDisabled: doc.isDisabled,
      memberCount: doc.memberCount,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
    });
  }

  toPersistence(entity: Server): Omit<IServerPersistence, OmittedDatabaseFields> {
    return {
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      banner: entity.banner,
      ownerId: entity.ownerId,
      privacy: entity.privacy,
      isDisabled: entity.isDisabled,
      memberCount: entity.memberCount,
      tags: entity.tags,
      deletedAt: entity.deletedAt,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Server>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.name !== undefined) update.name = partialDomain.name;
    if (partialDomain.description !== undefined) update.description = partialDomain.description;
    if (partialDomain.icon !== undefined) update.icon = partialDomain.icon;
    if (partialDomain.banner !== undefined) update.banner = partialDomain.banner;
    if (partialDomain.privacy !== undefined) update.privacy = partialDomain.privacy;
    if (partialDomain.isDisabled !== undefined) update.isDisabled = partialDomain.isDisabled;
    if (partialDomain.tags !== undefined) update.tags = partialDomain.tags;
    if (partialDomain.deletedAt !== undefined) update.deletedAt = partialDomain.deletedAt;
    return update;
  }
}
