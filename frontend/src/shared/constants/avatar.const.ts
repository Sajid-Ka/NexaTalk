export const AvatarStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  IDLE: "idle",
  DND: "dnd",
  STREAMING: "streaming",
} as const;

export type AvatarStatus =
  (typeof AvatarStatus)[keyof typeof AvatarStatus];


export const AvatarSize = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type AvatarSize =
  (typeof AvatarSize)[keyof typeof AvatarSize];