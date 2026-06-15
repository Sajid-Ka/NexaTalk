import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { IGetProfileUsecase } from "../interfaces/IGetProfileUsecase";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { UserPreviewResponse } from "../dtos/responses/UserPreviewResponse";
import { IGetUserPreviewUsecase } from "../interfaces/IGetUserPreviewUsecase";
import { UserRelationship } from "../../../shared/constants/relationship.const";

@injectable()
export class GetUserPreview implements IGetUserPreviewUsecase {
  constructor(
    @inject(USER_TYPES.GetProfile) private readonly _getProfile: IGetProfileUsecase,
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(targetUserId: string, requestingUserId: string): Promise<UserPreviewResponse> {
    this._logger.info("Getting user preview", { targetUserId, requestingUserId });

    // 1. Get the profile
    const userProfile = await this._getProfile.execute(targetUserId, requestingUserId);

    // 2. Determine relationship status
    let relationship: UserRelationship = UserRelationship.STRANGER;

    // Check if friends
    const isFriend = await this._friendRepo.checkIfFriends(requestingUserId, targetUserId);
    if (isFriend) {
      relationship = UserRelationship.FRIEND;
    } else {
      // Check if blocked
      const blockedUsers = await this._friendRepo.getBlockedUsers(requestingUserId);
      const amIBlockingThem = blockedUsers.some((b) => b.blockedUserId === targetUserId);

      if (amIBlockingThem) {
        relationship = UserRelationship.BLOCKED;
      }
    }

    return {
      user: userProfile,
      relationship,
    };
  }
}
