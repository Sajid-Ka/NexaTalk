import { inject, injectable } from "inversify";
import { IRecommendationService } from "../interfaces/IRecommendationService";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationQueryRepository } from "../../../domain/features/recommendations/repositories/IRecommendationQueryRepository";
import { RecommendedUser } from "../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../domain/features/recommendations/types/RecommendedServer";

@injectable()
export class RecommendationService implements IRecommendationService {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationQueryRepository)
    private readonly _repository: IRecommendationQueryRepository,
  ) {}

  async getRecommendedUsers(userId: string, limit = 5): Promise<RecommendedUser[]> {
    return this._repository.getRecommendedUsers(userId, limit);
  }

  async getRecommendedServers(userId: string, limit = 5): Promise<RecommendedServer[]> {
    return this._repository.getRecommendedServers(userId, limit);
  }
}
