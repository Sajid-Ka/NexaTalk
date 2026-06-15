import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ISearchUsersUsecase } from "../interfaces/ISearchUsersUsecase";
import { SearchUserResponse } from "../dtos/responses/SearchUserResponse";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { UserPresenceStatus } from "../../../shared/constants/userPresenceStatus.const";

@injectable()
export class SearchUsers implements ISearchUsersUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(FRIENDS_TYPES.FriendRepository)
    private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    query: string,
    limit: number = 10,
    excludeUserId?: string,
  ): Promise<SearchUserResponse[]> {
    this._logger.info("Searching users", { query, limit });

    if (!query || query.trim().length < 2) {
      return [];
    }

    // Search users by username
    const users = await this._userRepo.searchPublicProfiles(query, limit);

    // Filter out the current user if excludeUserId provided
    const filteredUsers = excludeUserId ? users.filter((u) => u.id !== excludeUserId) : users;

    const results: SearchUserResponse[] = [];

    for (const user of filteredUsers) {
      if (excludeUserId) {
        const isBlocked = await this._friendRepo.checkIfBlocked(excludeUserId, user.id);
        if (isBlocked) {
          continue; // Skip blocked users
        }
      }

      results.push({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        status: user.showOnlineStatus ? user.status : UserPresenceStatus.OFFLINE,
        isFriend: excludeUserId
          ? await this._friendRepo.checkIfFriends(excludeUserId, user.id)
          : false,
      });
    }

    return results;
  }
}
