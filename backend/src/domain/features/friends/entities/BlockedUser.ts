export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedUserId: string;
  createdAt: Date;
}
