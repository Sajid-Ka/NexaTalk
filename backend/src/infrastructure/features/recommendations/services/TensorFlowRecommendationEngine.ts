import { inject, injectable } from "inversify";
import * as tf from "@tensorflow/tfjs";
import { IRecommendationEngine } from "../../../../domain/features/recommendations/services/IRecommendationEngine";
import {
  UserInterestData,
  UserSimilarityScore,
  ServerSimilarityScore,
  RecommendationResult,
} from "../../../../domain/features/recommendations/types/recommendation.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { env } from "../../../../shared/config/env";

@injectable()
export class TensorFlowRecommendationEngine implements IRecommendationEngine {
  private readonly MIN_SIMILARITY_THRESHOLD = env.RECOMMENDATION_MIN_SIMILARITY_THRESHOLD;
  private readonly DEFAULT_LIMIT = env.RECOMMENDATION_DEFAULT_LIMIT;
  private readonly MAX_LIMIT = env.RECOMMENDATION_MAX_LIMIT;
  private readonly CACHE_TTL_HOURS = env.RECOMMENDATION_CACHE_TTL_HOURS;

  constructor(@inject(COMMON_TYPES.Logger) private _logger: ILogger) {}

  //create vector space from all users' interests
  async buildVectorSpace(usersInterests: UserInterestData[]): Promise<{
    userVectors: Map<string, Float32Array>;
    interestToIndex: Map<string, number>;
    totalInterests: number;
  }> {
    // Collect all unique interest IDs
    const uniqueInterestIds = new Set<string>();
    usersInterests.forEach((user) => {
      user.interestIds.forEach((id) => uniqueInterestIds.add(id));
    });

    // Create interest to index mapping
    const interestToIndex = new Map<string, number>();
    const interestList = Array.from(uniqueInterestIds);
    interestList.forEach((id, index) => {
      interestToIndex.set(id, index);
    });

    const totalInterests = interestList.length;
    const userVectors = new Map<string, Float32Array>();

    // Create vectors for each user (one-hot encoding)
    usersInterests.forEach((user) => {
      const vector = new Float32Array(totalInterests);

      user.interestIds.forEach((interestId) => {
        const index = interestToIndex.get(interestId);
        if (index !== undefined) {
          vector[index] = 1;
        }
      });

      userVectors.set(user.userId, vector);
    });

    return {
      userVectors,
      interestToIndex,
      totalInterests,
    };
  }

  //Calculate cosine similarity using TensorFlow
  calculateCosineSimilarity(vectorA: Float32Array, vectorB: Float32Array): number {
    if (vectorA.length !== vectorB.length) {
      throw new Error(`Vector length mismatch: ${vectorA.length} vs ${vectorB.length}`);
    }

    // Convert to tensors
    const tensorA = tf.tensor1d(Array.from(vectorA));
    const tensorB = tf.tensor1d(Array.from(vectorB));

    try {
      const dotProduct = tf.sum(tf.mul(tensorA, tensorB));
      const normA = tf.norm(tensorA);
      const normB = tf.norm(tensorB);

      const normProduct = tf.mul(normA, normB);
      const similarityTensor = tf.div(dotProduct, normProduct);

      const similarity = similarityTensor.dataSync()[0];

      tf.dispose([tensorA, tensorB, dotProduct, normA, normB, normProduct, similarityTensor]);

      if (isNaN(similarity) || !isFinite(similarity)) {
        return 0;
      }

      return similarity;
    } catch (error) {
      tf.dispose([tensorA, tensorB]);
      throw error;
    }
  }

  //Find users with similar interests
  async findSimilarUsers(
    targetUserId: string,
    targetInterestIds: string[],
    allUsersInterests: UserInterestData[],
    limit: number = this.DEFAULT_LIMIT,
    excludeUserIds: string[] = [],
  ): Promise<UserSimilarityScore[]> {
    const validLimit = Math.min(Math.max(1, limit), this.MAX_LIMIT);
    const excludeSet = new Set([...excludeUserIds, targetUserId]);

    // Build vector space
    const { userVectors } = await this.buildVectorSpace(allUsersInterests);

    const targetVector = userVectors.get(targetUserId);
    if (!targetVector) {
      return [];
    }

    const similarities: UserSimilarityScore[] = [];

    // Calculate similarity with each user
    for (const [userId, vector] of userVectors.entries()) {
      if (excludeSet.has(userId)) {
        continue;
      }

      const similarity = this.calculateCosineSimilarity(targetVector, vector);

      if (similarity > this.MIN_SIMILARITY_THRESHOLD) {
        const targetUser = allUsersInterests.find((u) => u.userId === targetUserId);
        const otherUser = allUsersInterests.find((u) => u.userId === userId);

        if (targetUser && otherUser) {
          const targetSet = new Set(targetUser.interestIds);
          const sharedInterests = otherUser.interestIds.filter((id) => targetSet.has(id));

          similarities.push({
            userId,
            similarityScore: similarity,
            sharedInterestIds: sharedInterests,
            sharedInterestCount: sharedInterests.length,
          });
        }
      }
    }

    // Sort by similarity (highest first) and limit
    return similarities.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, validLimit);
  }

  //Find servers matching user interests
  async findMatchingServers(
    userInterestIds: string[],
    serversInterests: Map<string, string[]>,
    limit: number = this.DEFAULT_LIMIT,
    excludeServerIds: string[] = [],
  ): Promise<ServerSimilarityScore[]> {
    const validLimit = Math.min(Math.max(1, limit), this.MAX_LIMIT);
    const excludeSet = new Set(excludeServerIds);
    const userInterestSet = new Set(userInterestIds);

    const matches: ServerSimilarityScore[] = [];

    for (const [serverId, serverInterests] of serversInterests.entries()) {
      if (excludeSet.has(serverId)) {
        continue;
      }

      const matchedInterests = serverInterests.filter((id) => userInterestSet.has(id));
      const matchCount = matchedInterests.length;

      if (matchCount > 0) {
        const unionSize = new Set([...userInterestIds, ...serverInterests]).size;
        const similarityScore = matchCount / unionSize;

        matches.push({
          serverId,
          similarityScore,
          matchedInterestIds: matchedInterests,
          matchedInterestCount: matchCount,
        });
      }
    }

    // Sort by match count and similarity
    return matches
      .sort((a, b) => {
        if (a.matchedInterestCount !== b.matchedInterestCount) {
          return b.matchedInterestCount - a.matchedInterestCount;
        }
        return b.similarityScore - a.similarityScore;
      })
      .slice(0, validLimit);
  }

  //Generate full recommendations for a user
  async generateRecommendations(
    userId: string,
    userInterestIds: string[],
    allUsersInterests: UserInterestData[],
    serversInterests: Map<string, string[]>,
    limit: number = this.DEFAULT_LIMIT,
  ): Promise<RecommendationResult> {
    const validLimit = Math.min(Math.max(1, limit), this.MAX_LIMIT);

    // Find similar users
    const similarUsers = await this.findSimilarUsers(
      userId,
      userInterestIds,
      allUsersInterests,
      validLimit,
    );

    // Find matching servers
    const matchingServers = await this.findMatchingServers(
      userInterestIds,
      serversInterests,
      validLimit,
    );

    const generatedAt = new Date();
    const expiresAt = new Date(generatedAt);
    expiresAt.setHours(expiresAt.getHours() + this.CACHE_TTL_HOURS);

    return {
      recommendedUsers: similarUsers,
      recommendedServers: matchingServers,
      generatedAt,
      expiresAt,
    };
  }

  //Batch generate recommendations for multiple users
  async batchGenerateRecommendations(
    usersData: Array<{ userId: string; interestIds: string[] }>,
    serversInterests: Map<string, string[]>,
    batchSize: number = 50,
  ): Promise<Map<string, RecommendationResult>> {
    const results = new Map<string, RecommendationResult>();
    const validBatchSize = Math.min(Math.max(1, batchSize), 100);

    for (let i = 0; i < usersData.length; i += validBatchSize) {
      const batch = usersData.slice(i, i + validBatchSize);

      const allUsersInterests: UserInterestData[] = usersData.map((u) => ({
        userId: u.userId,
        interestIds: u.interestIds,
      }));

      const batchPromises = batch.map(async (userData) => {
        try {
          const recommendations = await this.generateRecommendations(
            userData.userId,
            userData.interestIds,
            allUsersInterests,
            serversInterests,
          );
          return { userId: userData.userId, recommendations };
        } catch (error) {
          this._logger.error(`Failed to generate recommendations for user ${userData.userId}`, {
            error,
          });
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      batchResults.forEach((result) => {
        if (result) {
          results.set(result.userId, result.recommendations);
        }
      });
    }

    return results;
  }

  //Calculate similarity matrix for all users (useful for debugging/analytics
  async calculateSimilarityMatrix(
    usersInterests: UserInterestData[],
  ): Promise<{ userIds: string[]; matrix: number[][] }> {
    const { userVectors } = await this.buildVectorSpace(usersInterests);
    const userIds = Array.from(userVectors.keys());
    const matrix: number[][] = [];

    for (let i = 0; i < userIds.length; i++) {
      matrix[i] = [];
      const vectorI = userVectors.get(userIds[i])!;

      for (let j = 0; j < userIds.length; j++) {
        if (i === j) {
          matrix[i][j] = 1; // Self similarity
        } else {
          const vectorJ = userVectors.get(userIds[j])!;
          matrix[i][j] = this.calculateCosineSimilarity(vectorI, vectorJ);
        }
      }
    }

    return { userIds, matrix };
  }

  //Get user's interest vector as a readable string
  getUserVectorSummary(userId: string, usersInterests: UserInterestData[]): string {
    const user = usersInterests.find((u) => u.userId === userId);
    if (!user) {
      return `User ${userId} not found`;
    }

    return `User ${userId} has ${user.interestIds.length} interests: [${user.interestIds.join(", ")}]`;
  }

  //Get similarity summary between two users
  async getSimilaritySummary(
    userIdA: string,
    userIdB: string,
    usersInterests: UserInterestData[],
  ): Promise<string> {
    const userA = usersInterests.find((u) => u.userId === userIdA);
    const userB = usersInterests.find((u) => u.userId === userIdB);

    if (!userA || !userB) {
      return "One or both users not found";
    }

    const { userVectors } = await this.buildVectorSpace(usersInterests);
    const vectorA = userVectors.get(userIdA)!;
    const vectorB = userVectors.get(userIdB)!;

    const similarity = this.calculateCosineSimilarity(vectorA, vectorB);

    const sharedInterests = userB.interestIds.filter((id) => userA.interestIds.includes(id));

    return `Similarity between ${userIdA} and ${userIdB}: ${similarity.toFixed(4)} Shared interests: ${sharedInterests.length} (${sharedInterests.join(", ")})`;
  }
}
