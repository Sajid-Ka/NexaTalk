export const GroupRole = {
    OWNER : "owner",
    ADMIN : "admin",
    MEMBER : "member",
} as const;

export type GroupRole = (typeof GroupRole)[keyof typeof GroupRole];