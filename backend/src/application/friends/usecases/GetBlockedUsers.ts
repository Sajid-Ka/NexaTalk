import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

export interface BlockedUserDto {
  userId: string;
  username: string;
  avatar?: string;
  blockedAt: Date;
}

export interface IGetBlockedUsersUsecase {
  execute(userId: string): Promise<BlockedUserDto[]>;
}

@injectable()
export class GetBlockedUsers implements IGetBlockedUsersUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<BlockedUserDto[]> {
    this._logger.info("Getting blocked users", { userId });

    const blockedRecords = await this._friendRepo.getBlockedUsers(userId);
    const result: BlockedUserDto[] = [];

    for (const record of blockedRecords) {
      const blockedUser = await this._userRepo.findById(record.blockedUserId);
      if (blockedUser) {
        result.push({
          userId: blockedUser.id,
          username: blockedUser.username,
          avatar: blockedUser.avatar,
          blockedAt: record.createdAt,
        });
      }
    }

    return result;
  }
}
