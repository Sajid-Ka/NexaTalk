import { FriendRequestType } from "../../../shared/constants/Friend-request-type.const";
import { FriendResponse } from "../dtos/responses/FriendResponse";

export interface IGetPendingRequestsUsecase {
  execute(userId: string, type: FriendRequestType): Promise<FriendResponse[]>;
}
