import { Conversation } from "../../../domain/features/messages/entities/Conversation";
import { ConversationResponse } from "../dtos/responses/ConversationResponse";

export class ConversationResponseMapper {
  static toResponse(conversation: Conversation): ConversationResponse {
    return {
      id: conversation.id,
      type: conversation.type,

      ownerId: conversation.ownerId,
      name: conversation.name,
      avatar: conversation.avatar,

      participantIds: conversation.participantIds,

      channelId: conversation.channelId,

      lastMessageId: conversation.lastMessageId,

      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
