import { ServerInviteResponse } from "../dtos/responses/ServerResponse";

export interface ICreateServerInviteUsecase {
  execute(
    serverId: string,
    userId: string,
    maxUses?: number,
    expiresInDays?: number,
  ): Promise<ServerInviteResponse>;
}
