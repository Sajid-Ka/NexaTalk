import { ServerBanResponse } from "../dtos/responses/ServerBanResponse";

export interface IBanServerMemberUsecase {
  execute(
    serverId: string,
    currentUserId: string,
    targetUserId: string,
    reason?: string,
  ): Promise<ServerBanResponse>;
}
