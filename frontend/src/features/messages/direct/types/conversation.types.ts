import { UserPresence } from "../../../../shared/constants/user.const";

export interface DirectConversation {
    conversationId: string;
    userId: string;
    username: string;
    avatar?: string;
    bio?: string;
    presence: UserPresence;
    lastMessage?: string;
    lastMessageAt?: Date;
    unreadCount: number;
    isTyping: boolean;
}