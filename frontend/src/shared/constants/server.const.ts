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
