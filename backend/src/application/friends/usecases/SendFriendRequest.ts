import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { Friend } from "../../../domain/features/friends/entities/Friend";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { SendFriendRequestRequest } from "../dtos/requests/SendFrinedRequestRequest";
import { FriendResponse } from "../dtos/responses/FriendResponse";
import { FriendMapper } from "../mappers/FriendMapper";
import { ISendFriendRequestUsecase } from "../interfaces/ISendFriendRequestUsecase";

@injectable()
export class SendFriendRequest implements ISendFriendRequestUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: SendFriendRequestRequest): Promise<FriendResponse> {
    this._logger.info("Sending friend request", { userId, friendId: request.friendId });

    // Check if friend exists
    const friend = await this._userRepo.findById(request.friendId);
    if (!friend) {
      throw new NotFoundError("User not found");
    }

    // Cannot friend yourself
    if (userId === request.friendId) {
      throw new BadRequestError("You cannot send a friend request to yourself");
    }

    // Check if friendship already exists
    const existing = await this._friendRepo.findByUsers(userId, request.friendId);
    if (existing) {
      if (existing.status === FriendsStatus.ACCEPTED) {
        throw new BadRequestError("Already friends");
      }
      if (existing.status === FriendsStatus.PENDING) {
        throw new BadRequestError("Friend request already sent");
      }
      if (existing.status === FriendsStatus.BLOCKED) {
        throw new BadRequestError("Cannot send friend request to blocked user");
      }
    }

    // Create friend request
    const newFriend = new Friend({
      userId,
      friendId: request.friendId,
      status: FriendsStatus.PENDING,
    });

    const created = await this._friendRepo.create(newFriend);

    // Get friend details
    const friendUser = await this._userRepo.findById(request.friendId);
    const result = await FriendMapper.toResponse(created, friendUser!);

    this._logger.info("Friend request sent", { userId, friendId: request.friendId });

    return result;
  }
}
