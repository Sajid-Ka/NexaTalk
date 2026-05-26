import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";
import { IServerAuditLogPersistence } from "../database/ServerAuditLogModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerAuditLogPersistenceMapper implements IMapper<
  IServerAuditLogPersistence,
  ServerAuditLog
> {
  toDomain(doc: IServerAuditLogPersistence): ServerAuditLog {
    return new ServerAuditLog({
      id: doc._id.toString(),
      serverId: doc.serverId,
      actorId: doc.actorId,
      action: doc.action,
      targetId: doc.targetId ?? null,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(entity: ServerAuditLog): Omit<IServerAuditLogPersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      actorId: entity.actorId,
      action: entity.action,
      targetId: entity.targetId,
      metadata: entity.metadata,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ServerAuditLog>): Record<string, unknown> {
    const update: Record<string, unknown> = {};

    if (partialDomain.metadata !== undefined) update.metadata = partialDomain.metadata;

    return update;
  }
}
