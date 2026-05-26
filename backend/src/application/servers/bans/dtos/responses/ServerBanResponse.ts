export interface ServerBanResponse {
  id: string;
  serverId: string;
  userId: string;
  username: string;
  avatar?: string;
  bannedBy: string;
  reason: string;
  createdAt: Date;
}
