import { User } from "../../../../domain/features/auth/entities/User";
import { Message } from "../../../../domain/features/messages/entities/Message";
import { DirectConversationResponse } from "../dtos/responses/DirectConversationResponse";
import { Conversation } from "../../../../domain/features/messages/entities/Conversation";

export class DirectConversationResponseMapper {
  static toResponse(
    conversation: Conversation,
    user: User,
    lastMessage: Message | null,
    unreadCount: number,
  ): DirectConversationResponse {
    return {
      conversationId: conversation.id,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      presence: user.status,
      lastMessage: lastMessage?.content,
      lastMessageAt: lastMessage?.createdAt,
      unreadCount,
      isTyping: false,
    };
  }
}
