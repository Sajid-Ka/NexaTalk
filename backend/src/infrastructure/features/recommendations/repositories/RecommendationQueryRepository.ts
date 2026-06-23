import { injectable } from "inversify";
import { Types } from "mongoose";
import { IRecommendationQueryRepository } from "../../../../domain/features/recommendations/repositories/IRecommendationQueryRepository";
import { RecommendedUser } from "../../../../domain/features/recommendations/types/RecommendedUser";
import { RecommendedServer } from "../../../../domain/features/recommendations/types/RecommendedServer";
import { FriendModel } from "../../friends/models/FriendModel";
import { BlockedUserModel } from "../../friends/models/BlockedUserModel";
import { UserInterestModel } from "../../interests/models/UserInterestModel";
import { InterestModel } from "../../interests/models/InterestModel";
import { UserModel } from "../../auth/models/UserModel";
import { ServerModel } from "../../servers/models/ServerModel";
import { ServerMemberModel } from "../../servers/models/ServerMemberModel";
import { RecommendationMatching } from "../../../../shared/constants/recommendation.const";
import { UserPresenceStatus } from "../../../../shared/constants/user.const";

@injectable()
export class RecommendationQueryRepository implements IRecommendationQueryRepository {
  async getRecommendedUsers(userId: string, limit: number): Promise<RecommendedUser[]> {
    // 1. Get user's own interests
    const userInterests = await UserInterestModel.find({ userId }).lean();
    if (userInterests.length === 0) return [];

    const interestIds = userInterests.map((ui) => ui.interestId);

    // 2. Get excluded user IDs (self, friends, pending, blocked)
    const friendships = await FriendModel.find({
      $or: [{ userId }, { friendId: userId }],
    }).lean();

    const blocks = await BlockedUserModel.find({
      $or: [{ blockerId: userId }, { blockedUserId: userId }],
    }).lean();

    const excludedIds = new Set<string>([userId]);
    friendships.forEach((f) => {
      excludedIds.add(f.userId === userId ? f.friendId : f.userId);
    });
    blocks.forEach((b) => {
      excludedIds.add(b.blockerId === userId ? b.blockedUserId : b.blockerId);
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
        $match: { mutualInterestCount: { $gte: RecommendationMatching.MIN_MATCHING_INTERESTS } },
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
        isOnline: user.status === UserPresenceStatus.ONLINE,
      });
    }

    return recommendedUsers;
  }

  async getRecommendedServers(userId: string, limit: number): Promise<RecommendedServer[]> {
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
