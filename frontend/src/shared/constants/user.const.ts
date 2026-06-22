export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AccountStatus = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  DELETED: "deleted",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export const UserPresence = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;

export type UserPresence = (typeof UserPresence)[keyof typeof UserPresence];

export const UserTab = {
  ACTIVE: "active",
  BLOCKED: "blocked",
} as const;

export type UserTab = (typeof UserTab)[keyof typeof UserTab];