export interface ServerAuditLogResponse {
  id: string;
  serverId: string;
  actorId: string;
  actorUsername: string;
  action: string;
  targetId: string | null;
  targetUsername: string | null;
  details: Record<string, unknown>;
  createdAt: Date;
}
