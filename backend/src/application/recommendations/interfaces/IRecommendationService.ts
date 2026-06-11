import { RecommendedUser } from "../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../domain/features/recommendations/types/RecommendedServer";

export interface IRecommendationService {
  getRecommendedUsers(userId: string, limit?: number): Promise<RecommendedUser[]>;
  getRecommendedServers(userId: string, limit?: number): Promise<RecommendedServer[]>;
}
