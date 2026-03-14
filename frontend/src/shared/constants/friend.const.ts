export const FriendStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  IDLE: "idle",
  DND: "dnd",
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