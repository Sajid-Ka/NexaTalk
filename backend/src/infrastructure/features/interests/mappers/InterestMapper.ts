import { Interest } from "../../../../domain/features/interests/entities/Interest";
import { IInterestPersistence } from "../models/InterestModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";
import { InterestCategory } from "../../../../shared/constants/interests.const";

export class InterestMapper implements IMapper<IInterestPersistence, Interest> {
  toDomain(doc: IInterestPersistence): Interest {
    return new Interest({
      id: doc._id.toString(),
      name: doc.name,
      category: doc.category as InterestCategory,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: Interest): Omit<IInterestPersistence, OmittedDatabaseFields> {
    return {
      name: entity.name,
      category: entity.category,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Interest>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.name !== undefined) update.name = partialDomain.name;
    if (partialDomain.category !== undefined) update.category = partialDomain.category;
    return update;
  }
}
