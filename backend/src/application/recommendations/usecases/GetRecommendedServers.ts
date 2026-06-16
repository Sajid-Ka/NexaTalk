import { inject, injectable } from "inversify";
import { IGetRecommendedServersUsecase } from "../interfaces/IGetRecommendedServersUsecase";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationQueryRepository } from "../../../domain/features/recommendations/repositories/IRecommendationQueryRepository";
import { RecommendedServerResponse } from "../dtos/responses/RecommendedServerResponse";

@injectable()
export class GetRecommendedServers implements IGetRecommendedServersUsecase {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationQueryRepository)
    private readonly _recommendationQueryRepo: IRecommendationQueryRepository,
  ) {}

  async execute(userId: string, limit = 5): Promise<RecommendedServerResponse[]> {
    const servers = await this._recommendationQueryRepo.getRecommendedServers(userId, limit);
    return servers.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      memberCount: s.memberCount,
      tag: s.tag,
      matchedInterest: s.matchedInterest,
      recommendationScore: s.recommendationScore,
    }));
  }
}
