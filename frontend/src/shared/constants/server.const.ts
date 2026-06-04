export const ServerPrivacy = {
  PRIVATE: "private",
  PUBLIC: "public"
} as const;

export type ServerPrivacy =
  (typeof ServerPrivacy)[keyof typeof ServerPrivacy];

export const ServerMemberRole = {
    OWNER: "owner",
    ADMIN: "admin",
    MEMBER: "member",
}

export type ServerMemberRole =
  (typeof ServerMemberRole)[keyof typeof ServerMemberRole];

export const ServerImageType = {
  ICON: "icon",
  BANNER: "banner"
}

export type ServerImageType = (typeof ServerImageType)[keyof typeof ServerImageType];

export const ServerValidation = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS: 3,
  MAX_TAG_LENGTH: 30,
} as const;
