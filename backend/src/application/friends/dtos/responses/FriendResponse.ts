import { UserPresenceStatus } from "../../../../shared/constants/user.const";
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
