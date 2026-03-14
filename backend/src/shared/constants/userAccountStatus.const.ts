export const UserAccountStatus = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  DELETED: "deleted",
} as const;

export type UserAccountStatus = (typeof UserAccountStatus)[keyof typeof UserAccountStatus];
