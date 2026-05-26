import { ServerBanResponse } from "../dtos/responses/ServerBanResponse";

export interface IGetServerBansUsecase {
  execute(serverId: string, currentUserId: string): Promise<ServerBanResponse[]>;
}
