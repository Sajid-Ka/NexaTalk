import { AdminServerResponse } from "../dtos/responses/AdminServerResponse";

export interface IGetServerDetailsUsecase {
  execute(serverId: string): Promise<AdminServerResponse>;
}
