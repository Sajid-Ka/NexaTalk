export const ServerPrivacy = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type ServerPrivacy = (typeof ServerPrivacy)[keyof typeof ServerPrivacy];

export const ServerMemberRole = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type ServerMemberRole = (typeof ServerMemberRole)[keyof typeof ServerMemberRole];

export const ServerValidation = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS: 3,
  MAX_TAG_LENGTH: 30,
  DEFAULT_INVITE_MAX_USES: 0,
  DEFAULT_INVITE_TTL_DAYS: 7,
} as const;

export const ServerImageType = {
  ICON: "icon",
  BANNER: "banner",
} as const;

export type ServerImageType = (typeof ServerImageType)[keyof typeof ServerImageType];
