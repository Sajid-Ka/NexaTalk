export interface RecommendationScore {
  userId: string;
  score: number;
  matchedInterests: string[];
}

export interface ServerRecommendationScore {
  serverId: string;
  score: number;
  matchedInterests: string[];
}

export interface IRecommendationEngine {
  // Calculate similarity scores between users based on interests
  calculateUserSimilarity(
    targetUserInterests: string[],
    allUserInterests: Map<string, string[]>,
  ): Promise<RecommendationScore[]>;

  // Calculate relevance scores between users and servers
  calculateServerRelevance(
    userInterests: string[],
    serverInterests: Map<string, string[]>,
  ): Promise<ServerRecommendationScore[]>;

  // Generate personalized recommendations using collaborative filtering
  generateRecommendations(
    userId: string,
    userInterests: string[],
    allUsersInterests: Map<string, string[]>,
    allServersInterests: Map<string, string[]>,
    limit?: number,
  ): Promise<{
    recommendedUsers: RecommendationScore[];
    recommendedServers: ServerRecommendationScore[];
  }>;
}
