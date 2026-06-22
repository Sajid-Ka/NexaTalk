import { ServerInviteResponse } from "../dtos/responses/ServerInviteResponse";

export interface ICreateServerInviteUsecase {
  execute(
    serverId: string,
    userId: string,
    maxUses?: number,
    expiresInDays?: number,
  ): Promise<ServerInviteResponse>;
}
