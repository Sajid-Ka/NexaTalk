import { ServerDirectInvite } from "../../../../domain/features/servers/entities/ServerDirectInvite";

export interface ISendDirectServerInviteUsecase {
  execute(serverId: string, senderId: string, receiverId: string): Promise<ServerDirectInvite>;
}
