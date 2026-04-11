import { ServerMember } from "../../../../domain/features/servers/entities/ServerMember";
import { IServerMemberPersistence } from "../database/ServerMemberModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerMemberPersistenceMapper implements IMapper<
  IServerMemberPersistence,
  ServerMember
> {
  toDomain(doc: IServerMemberPersistence): ServerMember {
    return new ServerMember({
      id: doc._id.toString(),
      serverId: doc.serverId,
      userId: doc.userId,
      role: doc.role,
      joinedAt: doc.joinedAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: ServerMember): Omit<IServerMemberPersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      userId: entity.userId,
      role: entity.role,
      joinedAt: entity.joinedAt,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ServerMember>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.role !== undefined) update.role = partialDomain.role;
    if (partialDomain.updatedAt !== undefined) update.updatedAt = partialDomain.updatedAt;
    return update;
  }
}
