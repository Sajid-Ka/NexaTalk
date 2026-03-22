import { User } from "../../../domain/features/auth/entities/User";
import { Friend } from "../../../domain/features/friends/entities/Friend";
import { FriendResponse } from "../dtos/responses/FriendResponse";

export class FriendMapper {
  static async toResponse(friend: Friend, friendUser: User): Promise<FriendResponse> {
    return {
      id: friend.id,
      userId: friend.userId,
      friendId: friend.friendId,
      friend: {
        id: friendUser.id,
        username: friendUser.username,
        avatar: friendUser.avatar,
        status: friendUser.status,
        lastSeenAt: friendUser.lastSeenAt || undefined,
      },
      status: friend.status,
      createdAt: friend.createdAt,
    };
  }
}
