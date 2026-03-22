import { FriendsStatus } from "../../../../shared/constants/friends-status.const";

export interface FriendProps {
  id?: string;
  userId: string;
  friendId: string;
  status: FriendsStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Friend {
  public readonly id: string;
  public readonly userId: string;
  public readonly friendId: string;
  public status: FriendsStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: FriendProps) {
    if (!props.userId) throw new Error("userId is required");
    if (!props.friendId) throw new Error("friendId is required");
    if (props.userId === props.friendId) throw new Error("Cannot befriend yourself");

    this.id = props.id!;
    this.userId = props.userId;
    this.friendId = props.friendId;
    this.status = props.status;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isAccepted(): boolean {
    return this.status === FriendsStatus.ACCEPTED;
  }

  public isPending(): boolean {
    return this.status === FriendsStatus.PENDING;
  }

  public isBlocked(): boolean {
    return this.status === FriendsStatus.BLOCKED;
  }

  public accept(): void {
    this.status = FriendsStatus.ACCEPTED;
  }

  public block(): void {
    this.status = FriendsStatus.BLOCKED;
  }

  public reject(): void {
    // For delete/remove
  }
}
