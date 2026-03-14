export const ButtonVariant = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  GHOST: "ghost",
  OUTLINE: "outline",
} as const;

export type ButtonVariant =
  (typeof ButtonVariant)[keyof typeof ButtonVariant];


export const ButtonSize = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type ButtonSize =
  (typeof ButtonSize)[keyof typeof ButtonSize];