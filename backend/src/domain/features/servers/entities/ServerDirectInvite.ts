export interface ServerDirectInvite {
  id: string;
  serverId: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}
