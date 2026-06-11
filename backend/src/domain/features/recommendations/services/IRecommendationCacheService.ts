import { RecommendedUser } from "../types/RecommendedUser";
import { RecommendedServer } from "../types/RecommendedServer";

export interface IRecommendationCacheService {
  getCachedUsers(userId: string): Promise<RecommendedUser[] | null>;
  setCachedUsers(userId: string, users: RecommendedUser[], ttlSeconds?: number): Promise<void>;

  getCachedServers(userId: string): Promise<RecommendedServer[] | null>;
  setCachedServers(
    userId: string,
    servers: RecommendedServer[],
    ttlSeconds?: number,
  ): Promise<void>;

  invalidateUserCache(userId: string): Promise<void>;
}
