import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IGetUserServersUsecase {
  execute(userId: string): Promise<ServerResponse[]>;
}
