export const FriendStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;

export type FriendStatus =
  (typeof FriendStatus)[keyof typeof FriendStatus];


export const FriendTab = {
  ONLINE: "Online",
  ALL: "All",
  PENDING: "Pending",
  BLOCKED: "Blocked",
} as const;

export type FriendTab =
  (typeof FriendTab)[keyof typeof FriendTab];

export const FriendshipStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  BLOCKED: "blocked",
} as const;

export type FriendshipStatus =
(typeof FriendshipStatus)[keyof typeof FriendshipStatus];