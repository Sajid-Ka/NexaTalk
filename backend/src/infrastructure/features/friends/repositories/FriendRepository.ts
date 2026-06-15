import { injectable } from "inversify";
import { Friend } from "../../../../domain/features/friends/entities/Friend";
import {
  IFriendRepository,
  BlockedUserRecord,
} from "../../../../domain/features/friends/repositories/IFriendRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { FriendModel, IFriendPersistence } from "../models/FriendModel";
import { BlockedUserModel } from "../models/BlockedUserModel";
import { FriendPersistenceMapper } from "../mappers/FriendMapper";
import { FriendsStatus } from "../../../../shared/constants/friends-status.const";

// Define filter type
interface FriendFilter {
  $or?: Array<{ userId: string } | { friendId: string }>;
  status?: FriendsStatus;
}

@injectable()
export class FriendRepository
  extends BaseRepository<IFriendPersistence, Friend>
  implements IFriendRepository
{
  constructor() {
    super(FriendModel, new FriendPersistenceMapper());
  }

  async findByUsers(userId: string, friendId: string): Promise<Friend | null> {
    const doc = await this.model
      .findOne({
        $or: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findFriendsByUser(userId: string, status?: FriendsStatus): Promise<Friend[]> {
    const filter: FriendFilter = {
      $or: [{ userId }, { friendId: userId }],
    };

    if (status) {
      filter.status = status;
    }

    const docs = await this.model.find(filter).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findFriendIdsByUser(userId: string, status?: FriendsStatus): Promise<string[]> {
    const filter: FriendFilter = {
      $or: [{ userId }, { friendId: userId }],
    };

    if (status) {
      filter.status = status;
    }

    const docs = await this.model.find(filter).lean();
    return docs.map((doc) => (doc.userId === userId ? doc.friendId : doc.userId));
  }

  async findPendingRequests(userId: string): Promise<Friend[]> {
    const docs = await this.model
      .find({
        friendId: userId,
        status: FriendsStatus.PENDING,
      })
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findSentRequests(userId: string): Promise<Friend[]> {
    const docs = await this.model
      .find({
        userId,
        status: FriendsStatus.PENDING,
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async updateStatus(id: string, status: FriendsStatus): Promise<Friend> {
    const updated = await this.update(id, { status });
    if (!updated) throw new Error("Failed to update friend status");
    return updated;
  }

  async deleteFriend(userId: string, friendId: string): Promise<boolean> {
    const result = await this.model.deleteOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });
    return result.deletedCount > 0;
  }

  async checkIfFriends(userId: string, friendId: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      $or: [
        { userId, friendId, status: FriendsStatus.ACCEPTED },
        { userId: friendId, friendId: userId, status: FriendsStatus.ACCEPTED },
      ],
    });
    return count > 0;
  }

  async blockUser(blockerId: string, blockedUserId: string): Promise<void> {
    try {
      await BlockedUserModel.create({ blockerId, blockedUserId });
    } catch (error: unknown) {
      if ((error as { code?: number })?.code !== 11000) {
        // Ignore duplicate key error
        throw error;
      }
    }
  }

  async unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
    await BlockedUserModel.deleteOne({ blockerId, blockedUserId });
  }

  async getBlockedUsers(userId: string): Promise<BlockedUserRecord[]> {
    return await BlockedUserModel.find({ blockerId: userId }).lean();
  }

  async checkIfBlocked(userId1: string, userId2: string): Promise<boolean> {
    const count = await BlockedUserModel.countDocuments({
      $or: [
        { blockerId: userId1, blockedUserId: userId2 },
        { blockerId: userId2, blockedUserId: userId1 },
      ],
    });
    return count > 0;
  }
}
