import { Message } from "../../../../domain/features/messages/entities/Message";
import { MessageWithSender } from "../../../../domain/features/messages/types/MessageWithSender";
import { MessageItemResponse } from "../dtos/responses/MessagePageResponse";

export class MessageItemResponseMapper {
  static toResponse(message: Message, currentUserId: string): MessageItemResponse {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      sender: null,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
      isOwnMessage: message.senderId === currentUserId,
    };
  }

  static toResponseWithSender(
    messageWithSender: MessageWithSender,
    currentUserId: string,
  ): MessageItemResponse {
    const { message, sender } = messageWithSender;

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      sender: sender
        ? {
            id: sender.id,
            username: sender.username,
            avatar: sender.avatar,
          }
        : null,
      content: message.content,
      createdAt: message.createdAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
      isOwnMessage: message.senderId === currentUserId,
    };
  }
}
