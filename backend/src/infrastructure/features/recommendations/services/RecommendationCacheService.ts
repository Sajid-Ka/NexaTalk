import { injectable } from "inversify";
import { IRecommendationCacheService } from "../../../../domain/features/recommendations/services/IRecommendationCacheService";
import { RecommendedUser } from "../../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../../domain/features/recommendations/types/RecommendedServer";

// Simple in-memory cache for demonstration. Can be replaced with Redis later.
@injectable()
export class RecommendationCacheService implements IRecommendationCacheService {
  private _usersCache = new Map<string, { data: RecommendedUser[]; expiresAt: number }>();
  private _serversCache = new Map<string, { data: RecommendedServer[]; expiresAt: number }>();

  async getCachedUsers(userId: string): Promise<RecommendedUser[] | null> {
    const cached = this._usersCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    this._usersCache.delete(userId);
    return null;
  }

  async setCachedUsers(userId: string, users: RecommendedUser[], ttlSeconds = 1800): Promise<void> {
    this._usersCache.set(userId, {
      data: users,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async getCachedServers(userId: string): Promise<RecommendedServer[] | null> {
    const cached = this._serversCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    this._serversCache.delete(userId);
    return null;
  }

  async setCachedServers(
    userId: string,
    servers: RecommendedServer[],
    ttlSeconds = 1800,
  ): Promise<void> {
    this._serversCache.set(userId, {
      data: servers,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async invalidateUserCache(userId: string): Promise<void> {
    this._usersCache.delete(userId);
    this._serversCache.delete(userId);
  }
}
