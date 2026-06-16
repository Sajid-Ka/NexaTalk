import { inject, injectable } from "inversify";
import { IGetRecommendedUsersUsecase } from "../interfaces/IGetRecommendedUsersUsecase";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationQueryRepository } from "../../../domain/features/recommendations/repositories/IRecommendationQueryRepository";
import { RecommendedUserResponse } from "../dtos/responses/RecommendedUserResponse";

@injectable()
export class GetRecommendedUsers implements IGetRecommendedUsersUsecase {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationQueryRepository)
    private readonly _recommendationQueryRepo: IRecommendationQueryRepository,
  ) {}

  async execute(userId: string, limit = 5): Promise<RecommendedUserResponse[]> {
    const users = await this._recommendationQueryRepo.getRecommendedUsers(userId, limit);
    return users.map((u) => ({
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      mutualInterestCount: u.mutualInterestCount,
      mutualInterests: u.mutualInterests,
      recommendationScore: u.recommendationScore,
      isOnline: u.isOnline,
    }));
  }
}
