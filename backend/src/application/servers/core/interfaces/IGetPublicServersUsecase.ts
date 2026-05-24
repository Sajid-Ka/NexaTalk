import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IGetPublicServersUsecase {
  execute(limit?: number, offset?: number): Promise<ServerResponse[]>;
}
