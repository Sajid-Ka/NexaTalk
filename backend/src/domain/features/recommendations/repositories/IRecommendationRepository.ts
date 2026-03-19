import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Recommendation } from "../entities/Recommendation";

export interface IRecommendationRepository extends IBaseRepository<Recommendation> {
  findByUserId(userId: string): Promise<Recommendation | null>; // Find recommendation by user ID
  upsert(userId: string, data: Partial<Recommendation>): Promise<Recommendation>; // Update or create recommendation for a user
  deleteStale(ttlMinutes: number): Promise<number>; // Delete outdated (replaced) recommendations
}
