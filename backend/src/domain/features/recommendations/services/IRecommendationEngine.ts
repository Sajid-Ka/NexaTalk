import {
  UserInterestData,
  UserSimilarityScore,
  ServerSimilarityScore,
  RecommendationResult,
} from "../types/recommendation.types";

export interface IRecommendationEngine {
  // convert interest to vector
  buildVectorSpace(usersInterests: UserInterestData[]): Promise<{
    userVectors: Map<string, Float32Array>;
    interestToIndex: Map<string, number>;
    totalInterests: number;
  }>;

  // check similarity between two vectors
  calculateCosineSimilarity(vectorA: Float32Array, vectorB: Float32Array): number;

  //Find users with similar interests
  findSimilarUsers(
    targetUserId: string,
    targetInterestIds: string[],
    allUsersInterests: UserInterestData[],
    limit?: number,
    excludeUserIds?: string[]
  ): Promise<UserSimilarityScore[]>;

  //Find servers matching user interests
  findMatchingServers(
    userInterestIds: string[],
    serversInterests: Map<string, string[]>,
    limit?: number,
    excludeServerIds?: string[]
  ): Promise<ServerSimilarityScore[]>;

  //Generate full recommendations for a user
  generateRecommendations(
    userId: string,
    userInterestIds: string[],
    allUsersInterests: UserInterestData[],
    serversInterests: Map<string, string[]>,
    limit?: number
  ): Promise<RecommendationResult>;

  //Find recommended users and servers for multiple users (run once for multiple users instead of one user (efficient))
  batchGenerateRecommendations(
    usersData: Array<{ userId: string; interestIds: string[] }>,
    serversInterests: Map<string, string[]>,
    batchSize?: number
  ): Promise<Map<string, RecommendationResult>>;
}
