import { ServerBan } from "../../../../domain/features/servers/entities/ServerBan";
import { IServerBanPersistence } from "../models/ServerBanModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerBanPersistenceMapper implements IMapper<IServerBanPersistence, ServerBan> {
  toDomain(doc: IServerBanPersistence): ServerBan {
    return new ServerBan({
      id: doc._id.toString(),
      serverId: doc.serverId,
      userId: doc.userId,
      bannedBy: doc.bannedBy,
      reason: doc.reason,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(entity: ServerBan): Omit<IServerBanPersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      userId: entity.userId,
      bannedBy: entity.bannedBy,
      reason: entity.reason,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ServerBan>): Record<string, unknown> {
    const update: Record<string, unknown> = {};

    if (partialDomain.reason !== undefined) update.reason = partialDomain.reason;

    return update;
  }
}
