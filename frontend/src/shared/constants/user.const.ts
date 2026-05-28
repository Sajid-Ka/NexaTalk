export const UserRole = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  DELETED: "deleted",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserPresence = {
  ONLINE: "online",
  OFFLINE: "offline",
  IDLE: "idle",
  DND: "dnd",
} as const;

export type UserPresence = (typeof UserPresence)[keyof typeof UserPresence];

export const UserTab = {
  ACTIVE: "active",
  BLOCKED: "blocked",
} as const;

export type UserTab = (typeof UserTab)[keyof typeof UserTab];

export const AdminUserSortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type AdminUserSortOrder =
  (typeof AdminUserSortOrder)[keyof typeof AdminUserSortOrder];