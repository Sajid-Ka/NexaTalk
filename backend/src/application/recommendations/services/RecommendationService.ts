import { inject, injectable } from "inversify";
import { IRecommendationService } from "../interfaces/IRecommendationService";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationRepository } from "../../../domain/features/recommendations/repositories/IRecommendationRepository";
import { IRecommendationCacheService } from "../../../domain/features/recommendations/services/IRecommendationCacheService";
import { RecommendedUser } from "../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../domain/features/recommendations/types/RecommendedServer";

@injectable()
export class RecommendationService implements IRecommendationService {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationRepository)
    private readonly _repository: IRecommendationRepository,
    @inject(RECOMMENDATIONS_TYPES.RecommendationCacheService)
    private readonly _cache: IRecommendationCacheService,
  ) {}

  async getRecommendedUsers(userId: string, limit = 5): Promise<RecommendedUser[]> {
    const cached = await this._cache.getCachedUsers(userId);
    if (cached) return cached.slice(0, limit);

    const users = await this._repository.getRecommendedUsers(userId, limit);
    await this._cache.setCachedUsers(userId, users);

    return users;
  }

  async getRecommendedServers(userId: string, limit = 5): Promise<RecommendedServer[]> {
    const cached = await this._cache.getCachedServers(userId);
    if (cached) return cached.slice(0, limit);

    const servers = await this._repository.getRecommendedServers(userId, limit);
    await this._cache.setCachedServers(userId, servers);

    return servers;
  }
}
