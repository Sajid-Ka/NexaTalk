export const AvatarSize = {
  XS: "xs",
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type AvatarSize = (typeof AvatarSize)[keyof typeof AvatarSize];

export const AvatarStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
  STREAMING: "streaming",
} as const;

export type AvatarStatus = (typeof AvatarStatus)[keyof typeof AvatarStatus];

export const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  [AvatarSize.XS]: "h-6 w-6 text-[10px]",
  [AvatarSize.SM]: "h-8 w-8 text-xs",
  [AvatarSize.MD]: "h-10 w-10 text-sm",
  [AvatarSize.LG]: "h-12 w-12 text-base",
  [AvatarSize.XL]: "h-20 w-20 text-xl",
};

export const AVATAR_STATUS_COLORS: Record<AvatarStatus, string> = {
  [AvatarStatus.ONLINE]: "bg-green-500",
  [AvatarStatus.OFFLINE]: "bg-gray-500",
  [AvatarStatus.STREAMING]: "bg-purple-500",
};

export const AVATAR_STATUS_INDICATOR_SIZES: Record<AvatarSize, string> = {
  [AvatarSize.XS]: "h-1.5 w-1.5",
  [AvatarSize.SM]: "h-2 w-2",
  [AvatarSize.MD]: "h-3 w-3",
  [AvatarSize.LG]: "h-3 w-3",
  [AvatarSize.XL]: "h-3 w-3",
};
