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
  DEFAULT_INVITE_MAX_USES: 0,
} as const;


export const DirectInviteStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type DirectInviteStatus =
  (typeof DirectInviteStatus)[keyof typeof DirectInviteStatus];

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

export const ServerTagIcons: Record<ServerTag, string> = {
  [ServerTag.GAMING]: "🎮",
  [ServerTag.MUSIC]: "🎵",
  [ServerTag.MOVIES]: "🎬",
  [ServerTag.TV_SERIES]: "📺",
  [ServerTag.PROGRAMMING_TECHNOLOGY]: "💻",
  [ServerTag.SPORTS]: "⚽",
  [ServerTag.EDUCATION_LEARNING]: "📚",
  [ServerTag.ART_CREATIVITY]: "🎨",
};
