import { inject, injectable } from "inversify";
import { IGetRecommendedUsersUsecase } from "../interfaces/IGetRecommendedUsersUsecase";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationService } from "../interfaces/IRecommendationService";
import { RecommendedUserResponse } from "../dtos/responses/RecommendedUserResponse";

@injectable()
export class GetRecommendedUsers implements IGetRecommendedUsersUsecase {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationService)
    private readonly _recommendationService: IRecommendationService,
  ) {}

  async execute(userId: string, limit = 5): Promise<RecommendedUserResponse[]> {
    const users = await this._recommendationService.getRecommendedUsers(userId, limit);
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
