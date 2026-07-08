import type { FriendshipStatus } from "../../../shared/constants/friend.const";
import { UserPresence } from "../../../shared/constants/user.const";

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: {
    id: string;
    username: string;
    avatar?: string;
    status: UserPresence;
    lastSeenAt?: string;
  };
  status: FriendshipStatus;
  createdAt: string;
}

export interface FriendListResponse {
  friends: Friend[];
  total: number;
  online: number;
  offline: number;
}

export interface SendFriendRequestRequest {
  friendId: string;
}

export interface RespondFriendRequestRequest {
  status: Extract<FriendshipStatus, "accepted" | "blocked">;
}

export interface BlockedUserResponse {
  userId: string;
  username: string;
  avatar?: string;
  blockedAt: string;
}