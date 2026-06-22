import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { IConversationPersistence } from "../models/ConversationModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ConversationPersistenceMapper implements IMapper<
  IConversationPersistence,
  Conversation
> {
  toDomain(doc: IConversationPersistence): Conversation {
    return new Conversation({
      id: doc._id.toString(),
      type: doc.type,
      ownerId: doc.ownerId,
      name: doc.name,
      avatar: doc.avatar,
      participantIds: doc.participantIds,
      directKey: doc.directKey,
      channelId: doc.channelId,
      lastMessageId: doc.lastMessageId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: Conversation): Omit<IConversationPersistence, OmittedDatabaseFields> {
    return {
      type: entity.type,
      ownerId: entity.ownerId,
      name: entity.name,
      avatar: entity.avatar,
      participantIds: entity.participantIds,
      directKey: entity.directKey,
      channelId: entity.channelId,
      lastMessageId: entity.lastMessageId,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Conversation>): Record<string, unknown> {
    const update: Record<string, unknown> = {};

    if (partialDomain.ownerId !== undefined) update.ownerId = partialDomain.ownerId;

    if (partialDomain.name !== undefined) update.name = partialDomain.name;

    if (partialDomain.avatar !== undefined) update.avatar = partialDomain.avatar;
    if (partialDomain.participantIds !== undefined)
      update.participantIds = partialDomain.participantIds;

    if (partialDomain.directKey !== undefined) update.directKey = partialDomain.directKey;

    if (partialDomain.channelId !== undefined) update.channelId = partialDomain.channelId;

    if (partialDomain.lastMessageId !== undefined)
      update.lastMessageId = partialDomain.lastMessageId;

    return update;
  }
}
