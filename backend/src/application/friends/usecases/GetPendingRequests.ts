import { inject, injectable } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IFriendRepository } from "../../../domain/features/friends/repositories/IFriendRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { FriendResponse } from "../dtos/responses/FriendResponse";
import { FriendMapper } from "../mappers/FriendMapper";
import { FriendRequestType } from "../../../shared/constants/Friend-request-type.const";
import { IGetPendingRequestsUsecase } from "../interfaces/IGetPendingRequestsUsecase";

@injectable()
export class GetPendingRequests implements IGetPendingRequestsUsecase {
  constructor(
    @inject(FRIENDS_TYPES.FriendRepository) private readonly _friendRepo: IFriendRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    userId: string,
    type: FriendRequestType = FriendRequestType.RECEIVED,
  ): Promise<FriendResponse[]> {
    this._logger.info("Getting pending requests", { userId, type });

    let requests;
    if (type === FriendRequestType.RECEIVED) {
      requests = await this._friendRepo.findPendingRequests(userId);
    } else {
      requests = await this._friendRepo.findSentRequests(userId);
    }

    const responses: FriendResponse[] = [];

    for (const request of requests) {
      const friendId = type === FriendRequestType.RECEIVED ? request.userId : request.friendId;
      const friendUser = await this._userRepo.findById(friendId);

      if (friendUser) {
        responses.push(await FriendMapper.toResponse(request, friendUser));
      }
    }

    return responses;
  }
}
