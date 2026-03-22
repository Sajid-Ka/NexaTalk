import { Response } from "express";
import { injectable, inject } from "inversify";
import { FRIENDS_TYPES } from "../../../main/di/modules/friends/friends.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { SendFriendRequestRequest } from "../../../application/friends/dtos/requests/SendFrinedRequestRequest";
import { RespondFriendRequestRequest } from "../../../application/friends/dtos/requests/RespondFriendRequestRequest";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";
import { ISendFriendRequestUsecase } from "../../../application/friends/interfaces/ISendFriendRequestUsecase";
import { IRespondFriendRequestUsecase } from "../../../application/friends/interfaces/IRespondFriendRequestUsecase";
import { IGetFriendsUsecase } from "../../../application/friends/interfaces/IGetFriendsUsecase";
import { IGetPendingRequestsUsecase } from "../../../application/friends/interfaces/IGetPendingRequestsUsecase";
import { IRemoveFriendUsecase } from "../../../application/friends/interfaces/IRemoveFriendUsecase";
import { FriendRequestType } from "../../../shared/constants/Friend-request-type.const";

@injectable()
export class FriendController {
  constructor(
    @inject(FRIENDS_TYPES.SendFriendRequest)
    private readonly _sendFriendRequest: ISendFriendRequestUsecase,
    @inject(FRIENDS_TYPES.RespondFriendRequest)
    private readonly _respondFriendRequest: IRespondFriendRequestUsecase,
    @inject(FRIENDS_TYPES.GetFriends) private readonly _getFriends: IGetFriendsUsecase,
    @inject(FRIENDS_TYPES.GetPendingRequests)
    private readonly _getPendingRequests: IGetPendingRequestsUsecase,
    @inject(FRIENDS_TYPES.RemoveFriend) private readonly _removeFriend: IRemoveFriendUsecase,
  ) {}

  sendFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
    const request: SendFriendRequestRequest = {
      friendId: req.body.friendId,
    };
    const result = await this._sendFriendRequest.execute(req.user!.userId, request);
    res.json(successResponse(result, "Friend request sent"));
  };

  respondFriendRequest = async (req: AuthenticatedRequest, res: Response) => {
    const request: RespondFriendRequestRequest = {
      status: req.body.status,
    };
    const result = await this._respondFriendRequest.execute(
      req.user!.userId,
      req.params.userId,
      request,
    );
    res.json(successResponse(result, "Friend request responded"));
  };

  getFriends = async (req: AuthenticatedRequest, res: Response) => {
    const status = req.query.status as FriendsStatus | undefined;
    const search = req.query.search as string | undefined;
    const result = await this._getFriends.execute(req.user!.userId, status, search);
    res.json(successResponse(result, "Friends fetched"));
  };

  getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
    const type = (req.query.type as FriendRequestType) || FriendRequestType.RECEIVED;
    const result = await this._getPendingRequests.execute(req.user!.userId, type);
    res.json(successResponse(result, "Pending requests fetched"));
  };

  removeFriend = async (req: AuthenticatedRequest, res: Response) => {
    await this._removeFriend.execute(req.user!.userId, req.params.userId);
    res.json(successResponse(null, "Friend removed"));
  };
}
