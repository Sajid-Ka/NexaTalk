import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

export interface IUnblockUserUsecase {
  execute(blockerId: string, blockedUserId: string): Promise<void>;
}

@injectable()
export class UnblockUser implements IUnblockUserUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(blockerId: string, blockedUserId: string): Promise<void> {
    this._logger.info("Unblocking user", { blockerId, blockedUserId });

    await this._friendRepo.unblockUser(blockerId, blockedUserId);
  }
}
