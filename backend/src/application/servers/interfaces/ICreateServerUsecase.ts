import { CreateServerRequest } from "../dtos/requests/CreateServerRequest";
import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface ICreateServerUsecase {
  execute(userId: string, request: CreateServerRequest): Promise<ServerResponse>;
}