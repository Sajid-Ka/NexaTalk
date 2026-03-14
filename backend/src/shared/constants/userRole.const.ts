export const GlobalRole = {
  SUPER_ADMIN: "super_admin",
  USER: "user",
  ADMIN: "admin",
} as const;

export type GlobalRole = (typeof GlobalRole)[keyof typeof GlobalRole];
