import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IJoinServerUsecase {
  execute(serverId: string, userId: string): Promise<ServerResponse>;
}
