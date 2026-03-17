export const UserAccountStatus = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  DELETED: "deleted",
  SUSPENDED: "suspended",
} as const;

export type UserAccountStatus = (typeof UserAccountStatus)[keyof typeof UserAccountStatus];

export const AuthEvents = {
  LOGOUT: "auth:logout",
  FORCE_LOGOUT: "auth:force_logout",
  ACCOUNT_BLOCKED: "auth:account_blocked",
} as const;

export type AuthEvents = (typeof AuthEvents)[keyof typeof AuthEvents];
