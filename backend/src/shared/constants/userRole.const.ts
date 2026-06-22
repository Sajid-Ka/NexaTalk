export const GlobalRole = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type GlobalRole = (typeof GlobalRole)[keyof typeof GlobalRole];
