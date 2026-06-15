import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Friend } from "../entities/Friend";
import { FriendsStatus } from "../../../../shared/constants/friends-status.const";

export interface BlockedUserRecord {
  blockerId: string;
  blockedUserId: string;
  createdAt: Date;
}
export interface IFriendRepository extends IBaseRepository<Friend> {
  findByUsers(userId: string, friendId: string): Promise<Friend | null>;
  findFriendsByUser(userId: string, status?: FriendsStatus): Promise<Friend[]>;
  findFriendIdsByUser(userId: string, status?: FriendsStatus): Promise<string[]>;
  findPendingRequests(userId: string): Promise<Friend[]>;
  findSentRequests(userId: string): Promise<Friend[]>;
  updateStatus(id: string, status: FriendsStatus): Promise<Friend>;
  deleteFriend(userId: string, friendId: string): Promise<boolean>;
  checkIfFriends(userId: string, friendId: string): Promise<boolean>;

  // Block Operations
  blockUser(blockerId: string, blockedUserId: string): Promise<void>;
  unblockUser(blockerId: string, blockedUserId: string): Promise<void>;
  getBlockedUsers(userId: string): Promise<BlockedUserRecord[]>;
  checkIfBlocked(userId1: string, userId2: string): Promise<boolean>;
}
