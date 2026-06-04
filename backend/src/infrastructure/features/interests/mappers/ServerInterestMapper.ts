import { ServerInterest } from "../../../../domain/features/interests/entities/ServerInterest";
import { IServerInterestPersistence } from "../models/ServerInterestModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ServerInterestMapper implements IMapper<IServerInterestPersistence, ServerInterest> {
  toDomain(doc: IServerInterestPersistence): ServerInterest {
    return new ServerInterest({
      id: doc._id.toString(),
      serverId: doc.serverId,
      interestId: doc.interestId,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(entity: ServerInterest): Omit<IServerInterestPersistence, OmittedDatabaseFields> {
    return {
      serverId: entity.serverId,
      interestId: entity.interestId,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ServerInterest>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.serverId !== undefined) update.serverId = partialDomain.serverId;
    if (partialDomain.interestId !== undefined) update.interestId = partialDomain.interestId;
    return update;
  }
}
