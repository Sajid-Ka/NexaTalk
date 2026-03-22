import { SendFriendRequestRequest } from "../dtos/requests/SendFrinedRequestRequest";
import { FriendResponse } from "../dtos/responses/FriendResponse";

export interface ISendFriendRequestUsecase {
  execute(userId: string, request: SendFriendRequestRequest): Promise<FriendResponse>;
}
