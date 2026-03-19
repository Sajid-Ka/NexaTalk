import { Container } from "inversify";
import { RECOMMENDATIONS_TYPES } from "./recommendations.types";

import { RecommendationRepository } from "../../../../infrastructure/recommendations/repositories/RecommendationRepository";

import { GetRecommendations } from "../../../../application/recommendations/usecases/GetRecommendations";

import { RecommendationController } from "../../../../presentation/recommendations/controllers/RecommendationController";

export function loadRecommendationsModule(container: Container) {
  container
    .bind(RECOMMENDATIONS_TYPES.RecommendationRepository)
    .to(RecommendationRepository)
    .inSingletonScope();

  container.bind(RECOMMENDATIONS_TYPES.GetRecommendations).to(GetRecommendations);

  container.bind(RECOMMENDATIONS_TYPES.RecommendationController).to(RecommendationController);
}
