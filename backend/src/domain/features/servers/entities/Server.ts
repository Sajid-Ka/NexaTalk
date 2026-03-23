import { ServerPrivacy } from "../../../../shared/constants/server.const";

export interface ServerProps {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  privacy: ServerPrivacy;
  isDisabled?: boolean;
  memberCount?: number;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Server {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly icon?: string;
  public readonly banner?: string;
  public readonly ownerId: string;
  public readonly privacy: ServerPrivacy;
  public readonly isDisabled: boolean;
  public readonly memberCount: number;
  public readonly tags: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  constructor(props: ServerProps) {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error("Server name must be at least 2 characters");
    }
    if (props.name.trim().length > 100) {
      throw new Error("Server name must be at most 100 characters");
    }
    if (!props.ownerId) {
      throw new Error("Owner ID is required");
    }

    this.id = props.id!;
    this.name = props.name.trim();
    this.description = props.description;
    this.icon = props.icon;
    this.banner = props.banner;
    this.ownerId = props.ownerId;
    this.privacy = props.privacy;
    this.isDisabled = props.isDisabled ?? false;
    this.memberCount = props.memberCount ?? 1;
    this.tags = props.tags ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  public isPublic(): boolean {
    return this.privacy === ServerPrivacy.PUBLIC;
  }

  public isPrivate(): boolean {
    return this.privacy === ServerPrivacy.PRIVATE;
  }

  public isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  public softDelete(): void {
    // We'll handle through repository
  }
}