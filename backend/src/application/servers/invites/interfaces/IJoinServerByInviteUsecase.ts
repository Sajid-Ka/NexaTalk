import { ServerResponse } from "../../core/dtos/responses/ServerResponse";

export interface IJoinServerByInviteUsecase {
  execute(code: string, userId: string): Promise<ServerResponse>;
}
