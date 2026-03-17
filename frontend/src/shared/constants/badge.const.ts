export const BadgeVariant = {
  PRIMARY: "primary",
  DANGER: "danger",
  WARNING: "warning",
  SUCCESS: "success",
  SECONDARY: "secondary",
  INDIGO: "indigo",
  PURPLE: "purple"
} as const;

export type BadgeVariant =
  (typeof BadgeVariant)[keyof typeof BadgeVariant];