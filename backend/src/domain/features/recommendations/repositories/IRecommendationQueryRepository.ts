import { RecommendedUser } from "../types/RecommendedUser";
import { RecommendedServer } from "../types/RecommendedServer";

export interface IRecommendationQueryRepository {
  getRecommendedUsers(userId: string, limit: number): Promise<RecommendedUser[]>;
  getRecommendedServers(userId: string, limit: number): Promise<RecommendedServer[]>;
}