import { ServerMemberResponse } from "../dtos/responses/ServerMemberResponse";

export interface IGetServerMembersUsecase {
  execute(serverId: string, currentUserId: string): Promise<ServerMemberResponse[]>;
}
