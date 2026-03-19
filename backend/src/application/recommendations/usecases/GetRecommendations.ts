import { inject, injectable } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { IRecommendationRepository } from "../../../domain/features/recommendations/repositories/IRecommendationRepository";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { IInterestRepository } from "../../../domain/features/interests/repositories/IInterestRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IUserSettingsRepository } from "../../../domain/features/users/repositories/IUserSettingsRepository";
import { IRecommendationEngine } from "../../../domain/features/recommendations/services/IRecommendationEngine";
import { IGetRecommendationsUseCase } from "../interfaces/IGetRecommendationsUsecase";
import { RecommendationRequest } from "../dtos/requests/RecommendationRequest";
import { RecommendationResponse } from "../dtos/responses/RecommendationResponse";
import { InterestApplicationMapper } from "../../interests/mappers/InterestMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { RecommendationType } from "../../../shared/constants/recommendation-type.const";
import {
  UserWithInterestsResponse,
  ServerWithInterestsResponse,
} from "../../interests/dtos/responses/InterestResponse";
import { UserInterestData } from "../../../domain/features/recommendations/types/recommendation.types";

@injectable()
export class GetRecommendations implements IGetRecommendationsUseCase {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationRepository)
    private readonly _recommendationRepo: IRecommendationRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(USER_TYPES.UserSettingsRepository)
    private readonly _userSettingsRepo: IUserSettingsRepository,
    @inject(RECOMMENDATIONS_TYPES.RecommendationEngine)
    private readonly _engine: IRecommendationEngine,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: RecommendationRequest): Promise<RecommendationResponse> {
    this._logger.info("Getting recommendations", { userId, request });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const settings = await this._userSettingsRepo.findByUserId(userId);

    // Check if recommendations are disabled globally
    if (settings && !settings.showRecommendations) {
      this._logger.info("Recommendations disabled for user", { userId });
      return {
        people: [],
        servers: [],
        refreshedAt: new Date(),
        isStale: false,
        disabled: true,
      };
    }

    const limit = request.limit || 10;
    const type = request.type || RecommendationType.BOTH;

    let recommendations = await this._recommendationRepo.findByUserId(userId);

    // If recommendations are stale or refresh requested, generate new ones
    if (!recommendations || (request.refresh && recommendations.isStale(60))) {
      this._logger.info("Generating fresh recommendations", { userId });

      const allUsersInterests = await this._getAllUsersInterests();

      const userInterests = await this._userInterestRepo.getInterestIdsByUser(userId);

      const serversInterests = new Map<string, string[]>();

      const result = await this._engine.generateRecommendations(
        userId,
        userInterests,
        allUsersInterests,
        serversInterests,
        limit * 2, // Get more than needed for filtering
      );

      await this._recommendationRepo.upsert(userId, {
        recommendedUserIds: result.recommendedUsers.map((u) => u.userId),
        recommendedServerIds: [],
        lastRefreshedAt: result.generatedAt,
      });

      recommendations = await this._recommendationRepo.findByUserId(userId);
    }

    if (!recommendations) {
      return {
        people: [],
        servers: [],
        refreshedAt: new Date(),
        isStale: true,
        disabled: false,
      };
    }

    // Fetch full data for recommended users
    const people: UserWithInterestsResponse[] = [];
    if (
      (type === RecommendationType.PEOPLE || type === RecommendationType.BOTH) &&
      settings?.allowFriendRecommendations !== false
    ) {
      for (const recommendedUserId of recommendations.recommendedUserIds.slice(0, limit)) {
        const recommendedUser = await this._userRepo.findById(recommendedUserId);
        if (recommendedUser) {
          const interests = await this._userInterestRepo.findByUser(recommendedUserId);
          people.push(InterestApplicationMapper.toUserWithInterests(recommendedUser, interests));
        }
      }
    }

    const servers: ServerWithInterestsResponse[] = [];

    return {
      people,
      servers,
      refreshedAt: recommendations.lastRefreshedAt,
      isStale: recommendations.isStale(60),
      disabled: false,
    };
  }

  private async _getAllUsersInterests(): Promise<UserInterestData[]> {
    // This is a helper method - you'll need to implement based on your data access pattern
    // For now, return empty array
    return [];
  }
}
