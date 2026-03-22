import { injectable } from "inversify";
import { Friend } from "../../../../domain/features/friends/entities/Friend";
import { IFriendRepository } from "../../../../domain/features/friends/repositories/IFriendRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { FriendModel, IFriendPersistence } from "../database/FriendModel";
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
}
