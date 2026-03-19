import { UserInterest } from "../../../../domain/features/interests/entities/UserInterest";
import { IUserInterestPersistence } from "../database/UserInterestModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class UserInterestMapper implements IMapper<IUserInterestPersistence, UserInterest> {
  toDomain(doc: IUserInterestPersistence): UserInterest {
    return new UserInterest({
      id: doc._id.toString(),
      userId: doc.userId,
      interestId: doc.interestId,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(entity: UserInterest): Omit<IUserInterestPersistence, OmittedDatabaseFields> {
    return {
      userId: entity.userId,
      interestId: entity.interestId,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<UserInterest>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.userId !== undefined) update.userId = partialDomain.userId;
    if (partialDomain.interestId !== undefined) update.interestId = partialDomain.interestId;
    return update;
  }
}
