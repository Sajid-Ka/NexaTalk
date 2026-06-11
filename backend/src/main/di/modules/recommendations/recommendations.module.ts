import { Container } from "inversify";
import { RECOMMENDATIONS_TYPES } from "./recommendations.types";

import { RecommendationRepository } from "../../../../infrastructure/features/recommendations/repositories/RecommendationRepository";

import { TensorFlowRecommendationEngine } from "../../../../infrastructure/features/recommendations/services/TensorFlowRecommendationEngine";

import { GetRecommendations } from "../../../../application/recommendations/usecases/GetRecommendations";
import { GenerateRecommendations } from "../../../../application/recommendations/usecases/GenerateRecommendations";

import { RecommendationController } from "../../../../presentation/recommendations/controllers/RecommendationController";
import { RecommendationV1Controller } from "../../../../presentation/recommendations/controllers/RecommendationV1Controller";
import { RecommendationCacheService } from "../../../../infrastructure/features/recommendations/services/RecommendationCacheService";
import { RecommendationService } from "../../../../application/recommendations/services/RecommendationService";
import { GetRecommendedUsers } from "../../../../application/recommendations/usecases/GetRecommendedUsers";
import { GetRecommendedServers } from "../../../../application/recommendations/usecases/GetRecommendedServers";

export function loadRecommendationsModule(container: Container) {
  // Repositories
  container
    .bind(RECOMMENDATIONS_TYPES.RecommendationRepository)
    .to(RecommendationRepository)
    .inSingletonScope();

  // Services
  container
    .bind(RECOMMENDATIONS_TYPES.RecommendationEngine)
    .to(TensorFlowRecommendationEngine)
    .inSingletonScope();

  container
    .bind(RECOMMENDATIONS_TYPES.RecommendationCacheService)
    .to(RecommendationCacheService)
    .inSingletonScope();

  container
    .bind(RECOMMENDATIONS_TYPES.RecommendationService)
    .to(RecommendationService)
    .inSingletonScope();

  // Use Cases
  container.bind(RECOMMENDATIONS_TYPES.GetRecommendations).to(GetRecommendations);
  container.bind(RECOMMENDATIONS_TYPES.GenerateRecommendations).to(GenerateRecommendations);
  container.bind(RECOMMENDATIONS_TYPES.GetRecommendedUsers).to(GetRecommendedUsers);
  container.bind(RECOMMENDATIONS_TYPES.GetRecommendedServers).to(GetRecommendedServers);

  // Controllers
  container.bind(RECOMMENDATIONS_TYPES.RecommendationController).to(RecommendationController);
  container.bind(RECOMMENDATIONS_TYPES.RecommendationV1Controller).to(RecommendationV1Controller);
}
