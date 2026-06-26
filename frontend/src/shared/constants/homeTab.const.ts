export const HomeTab = {
    FRIENDS: "friends",
    DIRECTMESSAGES: "directMessages",
    GROUPMESSAGES: "groupMessages",
} as const;

export type HomeTab = (typeof HomeTab)[keyof typeof HomeTab];

export const HomeTabLabels = {
    FRIENDS_LABEL: "Friends",
    DIRECTMESSAGES_LABEL: "DirectMessages",
    GROUPMESSAGES_LABEL: "GroupMessages",
} as const;

export type HomeTabLabels = (typeof HomeTabLabels)[keyof typeof HomeTabLabels];