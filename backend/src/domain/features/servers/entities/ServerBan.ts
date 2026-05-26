export interface ServerBanProps {
  id?: string;
  serverId: string;
  userId: string;
  bannedBy: string;
  reason?: string;
  createdAt?: Date;
}

export class ServerBan {
  public readonly id: string;
  public readonly serverId: string;
  public readonly userId: string;
  public readonly bannedBy: string;
  public readonly reason: string;
  public readonly createdAt: Date;

  constructor(props: ServerBanProps) {
    if (!props.serverId) throw new Error("Server ID is required");
    if (!props.userId) throw new Error("User ID is required");
    if (!props.bannedBy) throw new Error("Banned by user ID is required");

    this.id = props.id!;
    this.serverId = props.serverId;
    this.userId = props.userId;
    this.bannedBy = props.bannedBy;
    this.reason = props.reason?.trim() ?? "";
    this.createdAt = props.createdAt ?? new Date();
  }
}
