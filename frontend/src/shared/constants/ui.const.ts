export const BadgeVariant = {
  PRIMARY: "primary",
  DANGER: "danger",
  WARNING: "warning",
  SUCCESS: "success",
  SECONDARY: "secondary",
  INDIGO: "indigo",
  PURPLE: "purple",
} as const;

export type BadgeVariant = (typeof BadgeVariant)[keyof typeof BadgeVariant];

export const ComponentStatus = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  IDLE: "idle",
} as const;

export type ComponentStatus = (typeof ComponentStatus)[keyof typeof ComponentStatus];
