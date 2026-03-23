export const ServerPrivacy = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export type ServerPrivacy = typeof ServerPrivacy[keyof typeof ServerPrivacy];

export const ServerMemberRole = {
  OWNER: "owner",
  ADMIN: "admin",
  MODERATOR: "moderator",
  MEMBER: "member",
} as const;

export type ServerMemberRole = typeof ServerMemberRole[keyof typeof ServerMemberRole];

// export const ServerErrorCode = {
//   SERVER_NOT_FOUND: "SERVER_NOT_FOUND",
//   SERVER_NAME_TOO_SHORT: "SERVER_NAME_TOO_SHORT",
//   SERVER_NAME_TOO_LONG: "SERVER_NAME_TOO_LONG",
//   SERVER_DESCRIPTION_TOO_LONG: "SERVER_DESCRIPTION_TOO_LONG",
//   SERVER_TAGS_LIMIT_EXCEEDED: "SERVER_TAGS_LIMIT_EXCEEDED",
//   ALREADY_MEMBER: "ALREADY_MEMBER",
//   NOT_MEMBER: "NOT_MEMBER",
//   INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
//   CANNOT_REMOVE_OWNER: "CANNOT_REMOVE_OWNER",
//   INVITE_INVALID: "INVITE_INVALID",
//   INVITE_EXPIRED: "INVITE_EXPIRED",
//   INVITE_MAX_USES_REACHED: "INVITE_MAX_USES_REACHED",
// } as const;

// export type ServerErrorCode = typeof ServerErrorCode[keyof typeof ServerErrorCode];

export const ServerValidation = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_TAGS: 5,
  MAX_TAG_LENGTH: 30,
  DEFAULT_INVITE_MAX_USES: 0,
  DEFAULT_INVITE_TTL_DAYS: 7,
} as const;