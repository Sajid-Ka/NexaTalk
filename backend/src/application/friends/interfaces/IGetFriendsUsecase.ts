import { FriendsStatus } from "../../../shared/constants/friends-status.const";
import { FriendListResponse } from "../dtos/responses/FriendResponse";

export interface IGetFriendsUsecase {
  execute(userId: string, status?: FriendsStatus, search?: string): Promise<FriendListResponse>;
}
