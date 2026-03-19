import { Container } from "inversify";
import { RECOMMENDATIONS_TYPES } from "./recommendations.types";

import { RecommendationRepository } from "../../../../infrastructure/features/recommendations/repositories/RecommendationRepository";

import { TensorFlowRecommendationEngine } from "../../../../infrastructure/features/recommendations/services/TensorFlowRecommendationEngine";

import { GetRecommendations } from "../../../../application/recommendations/usecases/GetRecommendations";
import { GenerateRecommendations } from "../../../../application/recommendations/usecases/GenerateRecommendations";

import { RecommendationController } from "../../../../presentation/recommendations/controllers/RecommendationController";

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

  // Use Cases
  container.bind(RECOMMENDATIONS_TYPES.GetRecommendations).to(GetRecommendations);
  container.bind(RECOMMENDATIONS_TYPES.GenerateRecommendations).to(GenerateRecommendations);

  // Controllers
  container.bind(RECOMMENDATIONS_TYPES.RecommendationController).to(RecommendationController);
}
