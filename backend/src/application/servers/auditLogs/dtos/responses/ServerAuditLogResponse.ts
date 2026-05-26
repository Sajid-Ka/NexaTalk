export interface ServerAuditLogResponse {
  id: string;
  serverId: string;
  actorId: string;
  actorUsername: string;
  action: string;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}
