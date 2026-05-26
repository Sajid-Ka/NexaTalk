export interface ServerAuditLogProps {
  id?: string;
  serverId: string;
  actorId: string;
  action: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

export class ServerAuditLog {
  public readonly id: string;
  public readonly serverId: string;
  public readonly actorId: string;
  public readonly action: string;
  public readonly targetId: string | null;
  public readonly metadata: Record<string, unknown>;
  public readonly createdAt: Date;

  constructor(props: ServerAuditLogProps) {
    if (!props.serverId) throw new Error("Server ID is required");
    if (!props.actorId) throw new Error("Actor ID is required");
    if (!props.action) throw new Error("Action is required");

    this.id = props.id!;
    this.serverId = props.serverId;
    this.actorId = props.actorId;
    this.action = props.action;
    this.targetId = props.targetId ?? null;
    this.metadata = props.metadata ?? {};
    this.createdAt = props.createdAt ?? new Date();
  }
}
