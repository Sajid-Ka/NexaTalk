export interface ServerInviteProps {
  id?: string;
  serverId: string;
  code: string;
  createdBy: string;
  maxUses?: number;
  expiresAt?: Date | null;
  uses?: number;
  createdAt?: Date;
}

export class ServerInvite {
  public readonly id: string;
  public readonly serverId: string;
  public readonly code: string;
  public readonly createdBy: string;
  public readonly maxUses: number;
  public readonly expiresAt: Date | null;
  public uses: number;
  public readonly createdAt: Date;

  constructor(props: ServerInviteProps) {
    if (!props.serverId) throw new Error("Server ID is required");
    if (!props.code) throw new Error("Invite code is required");
    if (!props.createdBy) throw new Error("Creator ID is required");

    this.id = props.id!;
    this.serverId = props.serverId;
    this.code = props.code;
    this.createdBy = props.createdBy;
    this.maxUses = props.maxUses ?? 0; // 0 means unlimited
    this.expiresAt = props.expiresAt ?? null;
    this.uses = props.uses ?? 0;
    this.createdAt = props.createdAt ?? new Date();
  }

  public isValid(): boolean {
    // Check expiration
    if (this.expiresAt && this.expiresAt.getTime() <= Date.now()) {
      return false;
    }
    
    // Check max uses
    if (this.maxUses > 0 && this.uses >= this.maxUses) {
      return false;
    }
    
    return true;
  }

  public use(): void {
    if (!this.isValid()) {
      throw new Error("Invite is no longer valid");
    }
    this.uses++;
  }
}