import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ForbiddenError } from "../../../domain/core/errors/ForbiddenError";
import { IRemoveFriendUsecase } from "../interfaces/IRemoveFriendUsecase";

@injectable()
export class RemoveFriend implements IRemoveFriendUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, friendId: string): Promise<void> {
    this._logger.info("Removing friend", { userId, friendId });

    // Check if friendship exists
    const friendship = await this._friendRepo.findByUsers(userId, friendId);
    if (!friendship) {
      throw new NotFoundError("Friendship not found");
    }

    // Verify user is part of this friendship
    if (friendship.userId !== userId && friendship.friendId !== userId) {
      throw new ForbiddenError("You are not part of this friendship");
    }

    // Delete the friendship
    await this._friendRepo.deleteFriend(userId, friendId);

    this._logger.info("Friend removed", { userId, friendId });
  }
}
