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

export const ServerStatus = {
  ALL: "all",
  ACTIVE: "active",
  DISABLED: "disabled",
} as const;

export type ServerStatus = (typeof ServerStatus)[keyof typeof ServerStatus];

export const ServerValidation = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  DEFAULT_INVITE_MAX_USES: 0,
  DEFAULT_INVITE_TTL_DAYS: 7,
} as const;

export const ServerImageType = {
  ICON: "icon",
  BANNER: "banner",
} as const;

export type ServerImageType = (typeof ServerImageType)[keyof typeof ServerImageType];

export const ServerTag = {
  GAMING: "Gaming",
  MUSIC: "Music",
  MOVIES: "Movies",
  TV_SERIES: "TV Series",
  PROGRAMMING_TECHNOLOGY: "Programming & Technology",
  SPORTS: "Sports",
  EDUCATION_LEARNING: "Education & Learning",
  ART_CREATIVITY: "Art & Creativity",
} as const;

export type ServerTag = (typeof ServerTag)[keyof typeof ServerTag];

export const SERVER_TAGS = Object.values(ServerTag);
