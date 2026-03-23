import { UpdateServerRequest } from "../dtos/requests/UpdateServerRequest";
import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IUpdateServerUsecase {
  execute(serverId: string, userId: string, request: UpdateServerRequest): Promise<ServerResponse>;
}