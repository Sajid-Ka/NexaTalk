import { ServerInvite } from "../../../../domain/features/servers/entities/ServerInvite";
import { IServerInvitePersistence } from "../database/ServerInviteModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerInvitePersistenceMapper implements IMapper<
  IServerInvitePersistence,
  ServerInvite
> {
  toDomain(doc: IServerInvitePersistence): ServerInvite {
    return new ServerInvite({
      id: doc._id.toString(),
      serverId: doc.serverId,
      code: doc.code,
      createdBy: doc.createdBy,
      maxUses: doc.maxUses,
      expiresAt: doc.expiresAt ?? null,
      uses: doc.uses,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(entity: ServerInvite): Omit<IServerInvitePersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      code: entity.code,
      createdBy: entity.createdBy,
      maxUses: entity.maxUses,
      expiresAt: entity.expiresAt,
      uses: entity.uses,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ServerInvite>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.uses !== undefined) update.uses = partialDomain.uses;
    return update;
  }
}
