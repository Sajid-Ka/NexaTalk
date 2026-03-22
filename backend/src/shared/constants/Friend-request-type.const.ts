export const FriendRequestType = {
  RECEIVED: "received",
  SENT: "sent",
} as const;

export type FriendRequestType = (typeof FriendRequestType)[keyof typeof FriendRequestType];
