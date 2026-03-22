import { RespondFriendRequestRequest } from "../dtos/requests/RespondFriendRequestRequest";
import { FriendResponse } from "../dtos/responses/FriendResponse";

export interface IRespondFriendRequestUsecase {
  execute(
    userId: string,
    friendId: string,
    request: RespondFriendRequestRequest,
  ): Promise<FriendResponse>;
}
