export const UserSettingsField = {
  SHOW_RECOMMENDATIONS: "showRecommendations",
  ALLOW_FRIEND_RECOMMENDATIONS: "allowFriendRecommendations",
  ALLOW_SERVER_RECOMMENDATIONS: "allowServerRecommendations",
} as const;

export type UserSettingsField = (typeof UserSettingsField)[keyof typeof UserSettingsField];
