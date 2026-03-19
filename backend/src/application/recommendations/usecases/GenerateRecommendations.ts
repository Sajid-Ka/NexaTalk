import { inject, injectable } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IRecommendationRepository } from "../../../domain/recommendations/repositories/IRecommendationRepository";
import { IUserInterestRepository } from "../../../domain/interests/repositories/IUserInterestRepository";
import { IRecommendationEngine } from "../../../domain/recommendations/services/IRecommendationEngine";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class GenerateRecommendations {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationRepository)
    private readonly _recommendationRepo: IRecommendationRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(RECOMMENDATIONS_TYPES.RecommendationEngine)
    private readonly _engine: IRecommendationEngine,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    this._logger.info("Generating recommendations", { userId });

    // Get all users' interests
    const allUsersInterests = await this._getAllUsersInterests();
    
    // Generate recommendations using TensorFlow
    const result = await this._engine.generateRecommendations(
      userId,
      allUsersInterests,
      20 // Get top 20 recommendations
    );

    // Save to database
    await this._recommendationRepo.upsert(userId, {
      recommendedUserIds: result.recommendedUsers.map(u => u.userId),
      recommendedServerIds: [],
      lastRefreshedAt: result.generatedAt,
    });

    this._logger.info("Recommendations generated", { 
      userId, 
      userCount: result.recommendedUsers.length 
    });
  }

  async generateForAllUsers(): Promise<void> {
    this._logger.info("Generating recommendations for all users");

    const allUsersInterests = await this._getAllUsersInterests();
    const userIds = Array.from(allUsersInterests.keys());
    
    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);
      
      const recommendations = await Promise.all(
        batch.map(async (userId) => {
          try {
            const result = await this._engine.generateRecommendations(
              userId,
              allUsersInterests,
              20
            );
            return {
              userId,
              data: {
                recommendedUserIds: result.recommendedUsers.map(u => u.userId),
                recommendedServerIds: [],
                lastRefreshedAt: result.generatedAt,
              },
            };
          } catch (error) {
            this._logger.error("Failed to generate recommendations for user", { userId, error });
            return null;
          }
        })
      );

      const validRecommendations = recommendations.filter(r => r !== null) as Array<{
        userId: string;
        data: Partial<import("../../../domain/recommendations/entities/Recommendation").Recommendation>;
      }>;

      if (validRecommendations.length > 0) {
        await this._recommendationRepo.bulkUpsert(validRecommendations);
      }

      this._logger.info(`Processed batch ${i / batchSize + 1}/${Math.ceil(userIds.length / batchSize)}`);
    }

    this._logger.info("All recommendations generated");
  }

  private async _getAllUsersInterests(): Promise<Map<string, string[]>> {
    // This is a helper method - you'll need to implement based on your data access pattern
    // For now, return empty map
    return new Map();
  }
}