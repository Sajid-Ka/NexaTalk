export interface ServerInviteResponse {
  id: string;
  code: string;
  serverId: string;
  createdBy: string;
  maxUses: number;
  uses: number;
  expiresAt: Date | null;
  createdAt: Date;
  inviteUrl: string;
}
