import { UserPresenceStatus } from "../../../../../shared/constants/user.const";

export interface DirectConversationResponse {
  conversationId: string;
  userId: string;
  username: string;
  avatar?: string;
  bio?: string;
  presence: UserPresenceStatus;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  isTyping: boolean;
}
