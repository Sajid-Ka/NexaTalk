export const UserSettingsField = {
  SHOW_RECOMMENDATIONS: "showRecommendations",
  ALLOW_FRIEND_RECOMMENDATIONS: "allowFriendRecommendations",
  ALLOW_SERVER_RECOMMENDATIONS: "allowServerRecommendations",
} as const;

export type UserSettingsField = (typeof UserSettingsField)[keyof typeof UserSettingsField];

export const UserPresenceStatus = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;

export type UserPresenceStatus = (typeof UserPresenceStatus)[keyof typeof UserPresenceStatus];

export const GlobalRole = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type GlobalRole = (typeof GlobalRole)[keyof typeof GlobalRole];
