export const FriendsStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  BLOCKED: "blocked",
} as const;

export type FriendsStatus = (typeof FriendsStatus)[keyof typeof FriendsStatus];
