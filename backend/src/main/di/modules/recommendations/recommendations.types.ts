export const RECOMMENDATIONS_TYPES = {
  // Repositories
  RecommendationRepository: Symbol.for("RecommendationRepository"),
  RecommendationQueryRepository: Symbol.for("RecommendationQueryRepository"),

  // Use Cases
  GenerateRecommendations: Symbol.for("GenerateRecommendations"),
  GetRecommendations: Symbol.for("GetRecommendations"),
  RefreshRecommendations: Symbol.for("RefreshRecommendations"),
  GetRecommendedUsers: Symbol.for("GetRecommendedUsers"),
  GetRecommendedServers: Symbol.for("GetRecommendedServers"),

  // Services
  RecommendationEngine: Symbol.for("RecommendationEngine"),
  RecommendationService: Symbol.for("RecommendationService"),
  RecommendationCacheService: Symbol.for("RecommendationCacheService"),

  // Controllers
  RecommendationController: Symbol.for("RecommendationController"),
  RecommendationV1Controller: Symbol.for("RecommendationV1Controller"),
};
