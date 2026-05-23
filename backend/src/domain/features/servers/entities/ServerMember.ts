import { ServerMemberRole } from "../../../../shared/constants/server.const";

export interface ServerMemberProps {
  id?: string;
  serverId: string;
  userId: string;
  role: ServerMemberRole;
  joinedAt?: Date;
  updatedAt?: Date;
}

export class ServerMember {
  public readonly id: string;
  public readonly serverId: string;
  public readonly userId: string;
  public role: ServerMemberRole;
  public readonly joinedAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ServerMemberProps) {
    if (!props.serverId) throw new Error("Server ID is required");
    if (!props.userId) throw new Error("User ID is required");

    this.id = props.id!;
    this.serverId = props.serverId;
    this.userId = props.userId;
    this.role = props.role;
    this.joinedAt = props.joinedAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isOwner(): boolean {
    return this.role === ServerMemberRole.OWNER;
  }

  public isAdmin(): boolean {
    return this.role === ServerMemberRole.ADMIN || this.role === ServerMemberRole.OWNER;
  }

  public promoteToAdmin(): void {
    this.role = ServerMemberRole.ADMIN;
  }

  public demoteToMember(): void {
    this.role = ServerMemberRole.MEMBER;
  }
}
