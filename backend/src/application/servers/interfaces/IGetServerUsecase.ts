import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IGetServerUsecase {
  execute(serverId: string, userId?: string): Promise<ServerResponse>;
}