import { inject, injectable } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { IRecommendationRepository } from "../../../domain/features/recommendations/repositories/IRecommendationRepository";
import { IRecommendationEngine } from "../../../domain/features/recommendations/services/IRecommendationEngine";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { UserInterestData } from "../../../domain/features/recommendations/types/recommendation.types";

@injectable()
export class GenerateRecommendations {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.RecommendationRepository)
    private readonly _recommendationRepo: IRecommendationRepository,
    @inject(RECOMMENDATIONS_TYPES.RecommendationEngine)
    private readonly _engine: IRecommendationEngine,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    this._logger.info("Generating recommendations", { userId });

    const allUsersInterests = await this._getAllUsersInterests();
    const userInterests = allUsersInterests.find((u) => u.userId === userId)?.interestIds || [];

    // Generate recommendations using TensorFlow
    const result = await this._engine.generateRecommendations(
      userId,
      userInterests,
      allUsersInterests,
      new Map<string, string[]>(),
      20,
    );

    // Save to database
    await this._recommendationRepo.upsert(userId, {
      recommendedUserIds: result.recommendedUsers.map((u) => u.userId),
      recommendedServerIds: [],
      lastRefreshedAt: result.generatedAt,
    });

    this._logger.info("Recommendations generated", {
      userId,
      userCount: result.recommendedUsers.length,
    });
  }

  async generateForAllUsers(): Promise<void> {
    this._logger.info("Generating recommendations for all users");

    const allUsersInterests = await this._getAllUsersInterests();
    const userIds = allUsersInterests.map((u) => u.userId);

    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize);

      const recommendations = await Promise.all(
        batch.map(async (userId) => {
          try {
            const userInterests =
              allUsersInterests.find((u) => u.userId === userId)?.interestIds || [];
            const result = await this._engine.generateRecommendations(
              userId,
              userInterests,
              allUsersInterests,
              new Map<string, string[]>(),
              20,
            );
            return {
              userId,
              data: {
                recommendedUserIds: result.recommendedUsers.map((u) => u.userId),
                recommendedServerIds: [],
                lastRefreshedAt: result.generatedAt,
              },
            };
          } catch (error) {
            this._logger.error("Failed to generate recommendations for user", { userId, error });
            return null;
          }
        }),
      );

      const validRecommendations = recommendations.filter((r) => r !== null) as Array<{
        userId: string;
        data: Partial<
          import("../../../domain/features/recommendations/entities/Recommendation").Recommendation
        >;
      }>;

      if (validRecommendations.length > 0) {
        await this._recommendationRepo.bulkUpsert(validRecommendations);
      }

      this._logger.info(
        `Processed batch ${i / batchSize + 1}/${Math.ceil(userIds.length / batchSize)}`,
      );
    }

    this._logger.info("All recommendations generated");
  }

  private async _getAllUsersInterests(): Promise<UserInterestData[]> {
    // Implement this method to fetch all users, For now, return empty map
    const users: UserInterestData[] = [];

    return users;
  }
}
