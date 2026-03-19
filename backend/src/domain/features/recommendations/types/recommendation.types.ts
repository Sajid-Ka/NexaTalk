export interface UserInterestData {
  userId: string;
  interestIds: string[];
}

export interface UserSimilarityScore {
  userId: string;
  similarityScore: number; // 0-1 cosine similarity
  sharedInterestIds: string[];
  sharedInterestCount: number;
}

export interface ServerSimilarityScore {
  serverId: string;
  similarityScore: number;
  matchedInterestIds: string[];
  matchedInterestCount: number;
}

export interface RecommendationResult {
  recommendedUsers: UserSimilarityScore[];
  recommendedServers: ServerSimilarityScore[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface InterestVector {
  userId: string;
  vector: Float32Array;
  interestIndices: number[];
}

export interface VectorSpace {
  interestToIndex: Map<string, number>;
  indexToInterest: Map<number, string>;
  totalInterests: number;
  userVectors: Map<string, Float32Array>;
}
