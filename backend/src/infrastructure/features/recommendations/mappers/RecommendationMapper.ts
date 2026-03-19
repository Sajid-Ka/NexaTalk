import { Recommendation } from "../../../../domain/features/recommendations/entities/Recommendation";
import { IRecommendationPersistence } from "../database/RecommendationModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class RecommendationMapper implements IMapper<IRecommendationPersistence, Recommendation> {
  toDomain(doc: IRecommendationPersistence): Recommendation {
    return new Recommendation({
      id: doc._id.toString(),
      userId: doc.userId,
      recommendedUserIds: doc.recommendedUserIds,
      recommendedServerIds: doc.recommendedServerIds,
      lastRefreshedAt: doc.lastRefreshedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: Recommendation): Omit<IRecommendationPersistence, OmittedDatabaseFields> {
    return {
      userId: entity.userId,
      recommendedUserIds: entity.recommendedUserIds,
      recommendedServerIds: entity.recommendedServerIds,
      lastRefreshedAt: entity.lastRefreshedAt,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Recommendation>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.recommendedUserIds !== undefined)
      update.recommendedUserIds = partialDomain.recommendedUserIds;
    if (partialDomain.recommendedServerIds !== undefined)
      update.recommendedServerIds = partialDomain.recommendedServerIds;
    if (partialDomain.lastRefreshedAt !== undefined)
      update.lastRefreshedAt = partialDomain.lastRefreshedAt;
    return update;
  }
}
