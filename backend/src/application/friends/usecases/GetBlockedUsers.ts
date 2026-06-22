import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { IGetBlockedUsersUsecase } from "../interfaces/IGetBlockedUserUsecase";
import { BlockedUserResponse } from "../dtos/responses/BlockedUserResponse";

@injectable()
export class GetBlockedUsers implements IGetBlockedUsersUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<BlockedUserResponse[]> {
    this._logger.info("Getting blocked users", { userId });

    const blockedRecords = await this._friendRepo.getBlockedUsers(userId);

    const blockedUserIds = blockedRecords.map((record) => record.blockedUserId);

    const users = await this._userRepo.findByIds(blockedUserIds);

    const usersMap = new Map(users.map((user) => [user.id, user]));

    return blockedRecords.flatMap((record) => {
      const user = usersMap.get(record.blockedUserId);

      if (!user) return [];

      return [
        {
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          blockedAt: record.createdAt,
        },
      ];
    });
  }
}
