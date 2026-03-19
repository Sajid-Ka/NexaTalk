import { inject, injectable } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IRecommendationRepository } from "../../../domain/recommendations/repositories/IRecommendationRepository";
import { IUserInterestRepository } from "../../../domain/interests/repositories/IUserInterestRepository";
import { IInterestRepository } from "../../../domain/interests/repositories/IInterestRepository";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IGetRecommendationsUseCase } from "../interfaces/IGetRecommendationsUsecase";
import { RecommendationRequest } from "../dtos/requests/RecommendationRequest";
import { RecommendationResponse } from "../dtos/responses/RecommendationResponse";
import { InterestApplicationMapper } from "../../interests/mappers/InterestMapper";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/errors/NotFoundError";
import { RecommendationType } from "../../../shared/constants/recommendation-type.const";
import {
  UserWithInterestsResponse,
  ServerWithInterestsResponse,
} from "../../interests/dtos/responses/InterestResponse";

@injectable()
export class GetRecommendations implements IGetRecommendationsUseCase {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationRepository)
    private readonly _recommendationRepo: IRecommendationRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: RecommendationRequest): Promise<RecommendationResponse> {
    this._logger.info("Getting recommendations", { userId, request });

    const limit = request.limit || 10;
    const type = request.type || RecommendationType.BOTH;

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Get existing recommendations
    const recommendations = await this._recommendationRepo.findByUserId(userId);

    // If no recommendations or stale and refresh requested, generate new ones
    if (!recommendations || (request.refresh && recommendations.isStale(60))) {
      return {
        people: [],
        servers: [],
        refreshedAt: new Date(),
        isStale: true,
      };
    }

    // Fetch full data for recommended users
    const people: UserWithInterestsResponse[] = [];
    if (type === "people" || type === "both") {
      for (const recommendedUserId of recommendations.recommendedUserIds.slice(0, limit)) {
        const recommendedUser = await this._userRepo.findById(recommendedUserId);
        if (recommendedUser) {
          const interests = await this._userInterestRepo.findByUser(recommendedUserId);
          people.push(InterestApplicationMapper.toUserWithInterests(recommendedUser, interests));
        }
      }
    }

    //Fetch full data for recommended servers
    const servers: ServerWithInterestsResponse[] = [];
    if (type === "servers" || type === "both") {
      // Server implementation will be added later
    }

    return {
      people,
      servers,
      refreshedAt: recommendations.lastRefreshedAt,
      isStale: recommendations.isStale(60),
    };
  }
}
