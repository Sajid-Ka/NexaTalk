import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { FriendListResponse, FriendResponse } from "../dtos/responses/FriendResponse";
import { FriendMapper } from "../mappers/FriendMapper";
import { UserPresenceStatus } from "../../../shared/constants/userPresenceStatus.const";
import { IGetFriendsUsecase } from "../interfaces/IGetFriendsUsecase";

@injectable()
export class GetFriends implements IGetFriendsUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    userId: string,
    status?: FriendsStatus,
    search?: string,
  ): Promise<FriendListResponse> {
    this._logger.info("Getting friends", { userId, status, search });

    // Get friends (accepted only)
    const friends = await this._friendRepo.findFriendsByUser(userId, FriendsStatus.ACCEPTED);

    // Get friend details
    const friendResponses: FriendResponse[] = [];
    let onlineCount = 0;

    for (const friendship of friends) {
      const friendId = friendship.userId === userId ? friendship.friendId : friendship.userId;
      const friendUser = await this._userRepo.findById(friendId);

      if (friendUser) {
        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          if (!friendUser.username.toLowerCase().includes(searchLower)) {
            continue;
          }
        }

        const response = await FriendMapper.toResponse(friendship, friendUser);
        friendResponses.push(response);

        if (friendUser.status === UserPresenceStatus.ONLINE) {
          onlineCount++;
        }
      }
    }

    return {
      friends: friendResponses,
      total: friendResponses.length,
      online: onlineCount,
      offline: friendResponses.length - onlineCount,
    };
  }
}
