import { Message } from "../../../domain/features/messages/entities/Message";
import { MessageItemResponse } from "../dtos/responses/MessagePageResponse";

export class MessageItemResponseMapper {
  static toResponse(message: Message, currentUserId: string): MessageItemResponse {
    return {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
      isOwnMessage: message.senderId === currentUserId,
    };
  }
}
