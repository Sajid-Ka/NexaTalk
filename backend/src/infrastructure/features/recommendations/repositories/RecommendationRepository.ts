import { injectable } from "inversify";
import { Recommendation } from "../../../../domain/features/recommendations/entities/Recommendation";
import { IRecommendationRepository } from "../../../../domain/features/recommendations/repositories/IRecommendationRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { RecommendationModel, IRecommendationPersistence } from "../database/RecommendationModel";
import { RecommendationMapper } from "../mappers/RecommendationMapper";

@injectable()
export class RecommendationRepository
  extends BaseRepository<IRecommendationPersistence, Recommendation>
  implements IRecommendationRepository
{
  constructor() {
    super(RecommendationModel, new RecommendationMapper());
  }

  async findByUserId(userId: string): Promise<Recommendation | null> {
    return this.findOne({ userId } as Partial<Recommendation>);
  }

  async upsert(userId: string, data: Partial<Recommendation>): Promise<Recommendation> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      const updated = await this.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
      return updated!;
    }

    const recommendation = new Recommendation({
      userId,
      recommendedUserIds: data.recommendedUserIds || [],
      recommendedServerIds: data.recommendedServerIds || [],
      lastRefreshedAt: data.lastRefreshedAt || new Date(),
    });

    return this.create(recommendation);
  }

  async deleteStale(ttlMinutes: number): Promise<number> {
    const staleDate = new Date();
    staleDate.setMinutes(staleDate.getMinutes() - ttlMinutes);

    const result = await this.model.deleteMany({
      lastRefreshedAt: { $lt: staleDate },
    });

    return result.deletedCount;
  }
}
