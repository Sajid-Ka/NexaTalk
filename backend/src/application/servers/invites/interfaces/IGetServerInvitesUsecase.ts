import { ServerInviteResponse } from "../dtos/responses/ServerInviteResponse";

export interface IGetServerInvitesUsecase {
  execute(serverId: string, userId: string): Promise<ServerInviteResponse[]>;
}
