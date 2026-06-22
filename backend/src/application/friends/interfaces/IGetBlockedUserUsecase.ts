import { BlockedUserResponse } from "../dtos/responses/BlockedUserResponse";

export interface IGetBlockedUsersUsecase {
  execute(userId: string): Promise<BlockedUserResponse[]>;
}
