import { ServerDirectInvite } from "../../../../domain/features/servers/entities/ServerDirectInvite";

export interface IGetSentDirectInvitesUsecase {
  execute(serverId: string, senderId: string): Promise<ServerDirectInvite[]>;
}
