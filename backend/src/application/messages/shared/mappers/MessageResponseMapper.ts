import { Message } from "../../../../domain/features/messages/entities/Message";
import { User } from "../../../../domain/features/auth/entities/User";
import { MessageResponse } from "../dtos/responses/MessageResponse";

export class MessageResponseMapper {
  static toResponse(message: Message, currentUserId: string, sender?: User): MessageResponse {
    const senderId = String(message.senderId);
    const viewerId = String(currentUserId);

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
      updatedAt: message.updatedAt,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
      isOwnMessage: senderId === viewerId,
    };
  }
}
