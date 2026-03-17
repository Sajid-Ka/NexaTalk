export type FriendStatus = "online" | "idle" | "offline";

export interface Friend {
    name: string;
    status: FriendStatus;
    activity?: string;
    avatar: string;
    streaming?: boolean;
}