import { Message } from "../../../../domain/features/messages/entities/Message";
import { IMessagePersistence } from "../models/MessageModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";
import { MessageWithSender } from "../../../../domain/features/messages/types/MessageWithSender";

type MessageWithSenderPersistence = IMessagePersistence & {
  sender?: Array<{
    _id: unknown;
    username: string;
    avatar?: string;
  }>;
};

export class MessagePersistenceMapper implements IMapper<IMessagePersistence, Message> {
  toDomain(doc: IMessagePersistence): Message {
    return new Message({
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      senderId: doc.senderId,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      editedAt: doc.editedAt,
      deletedAt: doc.deletedAt,
      hiddenForUserIds: doc.hiddenForUserIds ?? [],
    });
  }

  toPersistence(entity: Message): Omit<IMessagePersistence, OmittedDatabaseFields> {
    return {
      conversationId: entity.conversationId,
      senderId: entity.senderId,
      content: entity.content,
      editedAt: entity.editedAt,
      deletedAt: entity.deletedAt,
      hiddenForUserIds: entity.hiddenForUserIds,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Message>): Record<string, unknown> {
    const update: Record<string, unknown> = {};

    if (partialDomain.content !== undefined) update.content = partialDomain.content;

    if (partialDomain.editedAt !== undefined) update.editedAt = partialDomain.editedAt;

    if (partialDomain.deletedAt !== undefined) update.deletedAt = partialDomain.deletedAt;

    if (partialDomain.hiddenForUserIds !== undefined) {
      update.hiddenForUserIds = partialDomain.hiddenForUserIds;
    }

    return update;
  }

  toWithSenderDomain(doc: MessageWithSenderPersistence): MessageWithSender {
    const message = this.toDomain(doc);
    const sender = doc.sender?.[0];

    return {
      message,
      sender: sender
        ? {
            id: String(sender._id),
            username: sender.username,
            avatar: sender.avatar,
          }
        : null,
    };
  }
}
