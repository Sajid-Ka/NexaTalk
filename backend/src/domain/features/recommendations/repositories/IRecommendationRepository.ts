import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Recommendation } from "../entities/Recommendation";

export interface IRecommendationRepository extends IBaseRepository<Recommendation> {
  findByUserId(userId: string): Promise<Recommendation | null>;
  upsert(userId: string, data: Partial<Recommendation>): Promise<Recommendation>;
  deleteStale(ttlMinutes: number): Promise<number>;
  bulkUpsert(
    recommendations: Array<{ userId: string; data: Partial<Recommendation> }>,
  ): Promise<void>;
}
