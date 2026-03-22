import { UserPresenceStatus } from "../../../../shared/constants/userPresenceStatus.const";
import { FriendsStatus } from "../../../../shared/constants/friends-status.const";

export interface FriendResponse {
  id: string;
  userId: string;
  friendId: string;
  friend: {
    id: string;
    username: string;
    avatar?: string;
    status: UserPresenceStatus;
    lastSeenAt?: Date;
  };
  status: FriendsStatus;
  createdAt: Date;
}

export interface FriendListResponse {
  friends: FriendResponse[];
  total: number;
  online: number;
  offline: number;
}
