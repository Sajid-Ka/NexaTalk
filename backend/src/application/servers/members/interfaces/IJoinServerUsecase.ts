import { ServerResponse } from "../../core/dtos/responses/ServerResponse";

export interface IJoinServerUsecase {
  execute(serverId: string, userId: string): Promise<ServerResponse>;
}
