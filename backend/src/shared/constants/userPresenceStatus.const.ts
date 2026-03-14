export const UserPresenceStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  IDLE: "idle",
} as const;

export type UserPresenceStatus = (typeof UserPresenceStatus)[keyof typeof UserPresenceStatus];
