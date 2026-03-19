export const RECOMMENDATIONS_TYPES = {
  // Repositories
  RecommendationRepository: Symbol.for("RecommendationRepository"),

  // Use Cases (to be added)
  GenerateRecommendations: Symbol.for("GenerateRecommendations"),
  GetRecommendations: Symbol.for("GetRecommendations"),
  RefreshRecommendations: Symbol.for("RefreshRecommendations"),

  // Services
  RecommendationEngine: Symbol.for("RecommendationEngine"),

  // Controllers
  RecommendationController: Symbol.for("RecommendationController"),
};
