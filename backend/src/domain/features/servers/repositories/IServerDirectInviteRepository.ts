import { ServerDirectInvite } from "../entities/ServerDirectInvite";
import { PendingDirectInviteResponse } from "../../../../application/servers/invites/dtos/responses/PendingDirectInviteResponse";

export interface IServerDirectInviteRepository {
  create(data: Omit<ServerDirectInvite, "id" | "createdAt">): Promise<ServerDirectInvite>;
  findById(id: string): Promise<ServerDirectInvite | null>;
  findPendingByReceiver(receiverId: string): Promise<PendingDirectInviteResponse[]>;
  findPendingByServerAndReceiver(
    serverId: string,
    receiverId: string,
  ): Promise<ServerDirectInvite | null>;
  findPendingByServerAndSender(serverId: string, senderId: string): Promise<ServerDirectInvite[]>;
  updateStatus(id: string, status: "accepted" | "rejected"): Promise<ServerDirectInvite>;
  rejectOtherPendingForServer(
    serverId: string,
    receiverId: string,
    exceptInviteId: string,
  ): Promise<void>;
}
