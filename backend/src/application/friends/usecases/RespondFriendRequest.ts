import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ForbiddenError } from "../../../domain/core/errors/ForbiddenError";
import { RespondFriendRequestRequest } from "../dtos/requests/RespondFriendRequestRequest";
import { FriendResponse } from "../dtos/responses/FriendResponse";
import { FriendMapper } from "../mappers/FriendMapper";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { IRespondFriendRequestUsecase } from "../interfaces/IRespondFriendRequestUsecase";

@injectable()
export class RespondFriendRequest implements IRespondFriendRequestUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    userId: string,
    friendId: string,
    request: RespondFriendRequestRequest,
  ): Promise<FriendResponse> {
    this._logger.info("Responding to friend request", { userId, friendId, status: request.status });

    // Find the friendship
    const friendship = await this._friendRepo.findByUsers(userId, friendId);
    if (!friendship) {
      throw new NotFoundError("Friend request not found");
    }

    // Verify that the user is the recipient
    if (friendship.friendId !== userId) {
      throw new ForbiddenError("You cannot respond to this friend request");
    }

    if (friendship.status !== FriendsStatus.PENDING) {
      throw new BadRequestError("This friend request has already been processed");
    }

    const updated = await this._friendRepo.updateStatus(friendship.id, request.status);

    const friendUser = await this._userRepo.findById(friendId);
    const result = await FriendMapper.toResponse(updated, friendUser!);

    this._logger.info("Friend request responded", { userId, friendId, status: request.status });

    return result;
  }
}
