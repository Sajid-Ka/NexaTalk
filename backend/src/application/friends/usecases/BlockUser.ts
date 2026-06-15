import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

export interface IBlockUserUsecase {
  execute(blockerId: string, blockedUserId: string): Promise<void>;
}

@injectable()
export class BlockUser implements IBlockUserUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(blockerId: string, blockedUserId: string): Promise<void> {
    this._logger.info("Blocking user", { blockerId, blockedUserId });

    // 1. Remove any existing friendship or pending request
    await this._friendRepo.deleteFriend(blockerId, blockedUserId);

    // 2. Create the block
    await this._friendRepo.blockUser(blockerId, blockedUserId);
  }
}
