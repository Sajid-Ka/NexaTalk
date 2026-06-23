import { Message } from "../../../domain/features/messages/entities/Message";
import { MessageResponse } from "../dtos/responses/MessageResponse";

export class MessageResponseMapper {
  static toResponse(message: Message): MessageResponse {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
    };
  }
}
