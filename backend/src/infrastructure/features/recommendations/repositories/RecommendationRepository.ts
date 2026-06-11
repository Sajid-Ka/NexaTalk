import { injectable } from "inversify";
import { Types } from "mongoose";
import { Recommendation } from "../../../../domain/features/recommendations/entities/Recommendation";
import { IRecommendationRepository } from "../../../../domain/features/recommendations/repositories/IRecommendationRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { RecommendationModel, IRecommendationPersistence } from "../models/RecommendationModel";
import { RecommendationMapper } from "../mappers/RecommendationMapper";
import { RecommendedUser } from "../../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../../domain/features/recommendations/types/RecommendedServer";

@injectable()
export class RecommendationRepository
  extends BaseRepository<IRecommendationPersistence, Recommendation>
  implements IRecommendationRepository
{
  constructor() {
    super(RecommendationModel, new RecommendationMapper());
  }

  async findByUserId(userId: string): Promise<Recommendation | null> {
    return this.findOne({ userId } as Partial<Recommendation>);
  }

  async upsert(userId: string, data: Partial<Recommendation>): Promise<Recommendation> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      const updated = await this.update(existing.id, {
        ...data,
        updatedAt: new Date(),
      });
      return updated!;
    }

    const recommendation = new Recommendation({
      userId,
      recommendedUserIds: data.recommendedUserIds || [],
      recommendedServerIds: data.recommendedServerIds || [],
      lastRefreshedAt: data.lastRefreshedAt || new Date(),
    });

    return this.create(recommendation);
  }

  async deleteStale(ttlMinutes: number): Promise<number> {
    const staleDate = new Date();
    staleDate.setMinutes(staleDate.getMinutes() - ttlMinutes);

    const result = await this.model.deleteMany({
      lastRefreshedAt: { $lt: staleDate },
    });

    return result.deletedCount;
  }

  async bulkUpsert(
    recommendations: Array<{ userId: string; data: Partial<Recommendation> }>,
  ): Promise<void> {
    const operations = recommendations.map(({ userId, data }) => ({
      updateOne: {
        filter: { userId },
        update: {
          $set: {
            recommendedUserIds: data.recommendedUserIds,
            recommendedServerIds: data.recommendedServerIds,
            lastRefreshedAt: data.lastRefreshedAt || new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.model.bulkWrite(operations);
    }
  }

  async getRecommendedUsers(userId: string, limit: number): Promise<RecommendedUser[]> {
    const { FriendModel } = await import("../../friends/models/FriendModel");
    const { UserInterestModel } = await import("../../interests/models/UserInterestModel");
    const { InterestModel } = await import("../../interests/models/InterestModel");
    const { UserModel } = await import("../../auth/models/UserModel");
    const { RECOMMENDATION_CONSTANTS } =
      await import("../../../../domain/features/recommendations/constants/RecommendationConstants");

    // 1. Get user's own interests
    const userInterests = await UserInterestModel.find({ userId }).lean();
    if (userInterests.length === 0) return [];

    const interestIds = userInterests.map((ui) => ui.interestId);

    // 2. Get excluded user IDs (self, friends, blocked)
    const friendsOrBlocked = await FriendModel.find({
      $or: [{ userId }, { friendId: userId }],
    }).lean();

    const excludedIds = new Set<string>([userId]);
    friendsOrBlocked.forEach((f) => {
      excludedIds.add(f.userId === userId ? f.friendId : f.userId);
    });

    // 3. Aggregate matching users
    const results = await UserInterestModel.aggregate([
      { $match: { interestId: { $in: interestIds }, userId: { $nin: Array.from(excludedIds) } } },
      {
        $group: {
          _id: "$userId",
          mutualInterestCount: { $sum: 1 },
          matchedInterestIds: { $push: "$interestId" },
        },
      },
      {
        $match: { mutualInterestCount: { $gte: RECOMMENDATION_CONSTANTS.MIN_MATCHING_INTERESTS } },
      },
      { $sort: { mutualInterestCount: -1, _id: -1 } },
      { $limit: limit * 2 }, // Fetch some extra to account for deleted/blocked users filtered later
    ]);

    if (results.length === 0) return [];

    const recommendedUsers: RecommendedUser[] = [];
    for (const res of results) {
      if (recommendedUsers.length >= limit) break;

      const user = await UserModel.findOne({
        _id: res._id,
        isBlocked: false,
        isProfilePublic: true,
        deletedAt: null,
      }).lean();

      if (!user) continue;

      // Fetch actual interest names
      const interests = await InterestModel.find({
        _id: {
          $in: res.matchedInterestIds.map((id: string) => new Types.ObjectId(id)),
        },
      }).lean();

      recommendedUsers.push({
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar || "",
        mutualInterestCount: res.mutualInterestCount,
        mutualInterests: interests.map((i) => i.name),
        recommendationScore: res.mutualInterestCount,
        isOnline: user.status === "online",
      });
    }

    return recommendedUsers;
  }

  async getRecommendedServers(userId: string, limit: number): Promise<RecommendedServer[]> {
    const { UserInterestModel } = await import("../../interests/models/UserInterestModel");
    const { InterestModel } = await import("../../interests/models/InterestModel");
    const { ServerModel } = await import("../../servers/models/ServerModel");
    const { ServerMemberModel } = await import("../../servers/models/ServerMemberModel");

    const userInterests = await UserInterestModel.find({ userId }).lean();
    if (userInterests.length === 0) return [];

    const interestIds = userInterests.map((ui) => new Types.ObjectId(ui.interestId));
    const interests = await InterestModel.find({ _id: { $in: interestIds } }).lean();
    const interestNames = interests.map((i) => i.name.toLowerCase());

    const joinedServers = await ServerMemberModel.find({ userId }).lean();
    const joinedServerIds = joinedServers.map((js) => js.serverId);

    const servers = await ServerModel.find({
      _id: { $nin: joinedServerIds.map((id) => new Types.ObjectId(id)) },
      privacy: "public",
      isDisabled: false,
      deletedAt: null,
      memberCount: { $gte: 1 },
    })
      .sort({ memberCount: -1, _id: -1 })
      .lean();

    const recommendedServers: RecommendedServer[] = [];
    for (const server of servers) {
      if (recommendedServers.length >= limit) break;

      const matchedInterestName = interestNames.find(
        (i) => server.tag.toLowerCase().includes(i) || i.includes(server.tag.toLowerCase()),
      );
      const score = matchedInterestName ? 1 : 0;

      if (score > 0) {
        recommendedServers.push({
          id: server._id.toString(),
          name: server.name,
          icon: server.icon || null,
          memberCount: server.memberCount,
          tag: server.tag,
          matchedInterest: matchedInterestName || server.tag,
          recommendationScore: score,
        });
      }
    }

    return recommendedServers;
  }
}
