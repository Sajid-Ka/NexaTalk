import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { IConversationParticipantPersistence } from "../models/ConversationParticipantModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class ConversationParticipantPersistenceMapper implements IMapper<
  IConversationParticipantPersistence,
  ConversationParticipant
> {
  toDomain(doc: IConversationParticipantPersistence): ConversationParticipant {
    return new ConversationParticipant({
      id: doc._id.toString(),
      conversationId: doc.conversationId,
      userId: doc.userId,
      lastReadMessageId: doc.lastReadMessageId,
      joinedAt: doc.joinedAt,
    });
  }

  toPersistence(
    entity: ConversationParticipant,
  ): Omit<IConversationParticipantPersistence, OmittedDatabaseFields> {
    return {
      conversationId: entity.conversationId,
      userId: entity.userId,
      lastReadMessageId: entity.lastReadMessageId,
      joinedAt: entity.joinedAt,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ConversationParticipant>): Record<string, unknown> {
    const update: Record<string, unknown> = {};

    if (partialDomain.lastReadMessageId !== undefined)
      update.lastReadMessageId = partialDomain.lastReadMessageId;

    return update;
  }
}
