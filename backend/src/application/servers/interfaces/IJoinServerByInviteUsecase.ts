import { ServerResponse } from "../dtos/responses/ServerResponse";

export interface IJoinServerByInviteUsecase {
  execute(code: string, userId: string): Promise<ServerResponse>;
}
