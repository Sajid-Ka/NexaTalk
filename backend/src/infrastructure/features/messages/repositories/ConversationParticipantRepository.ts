import { injectable } from "inversify";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import {
  ConversationParticipantModel,
  IConversationParticipantPersistence,
} from "../models/ConversationParticipantModel";
import { ConversationParticipantPersistenceMapper } from "../mappers/ConversationParticipantMapper";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";

@injectable()
export class ConversationParticipantRepository
  extends BaseRepository<IConversationParticipantPersistence, ConversationParticipant>
  implements IConversationParticipantRepository
{
  constructor() {
    super(ConversationParticipantModel, new ConversationParticipantPersistenceMapper());
  }

  async findParticipant(
    conversationId: string,
    userId: string,
  ): Promise<ConversationParticipant | null> {
    const doc = await this.model
      .findOne({
        conversationId,
        userId,
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async getParticipants(conversationId: string): Promise<ConversationParticipant[]> {
    const docs = await this.model
      .find({
        conversationId,
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async removeParticipant(conversationId: string, userId: string): Promise<boolean> {
    const result = await this.model.deleteOne({
      conversationId,
      userId,
    });

    return result.deletedCount > 0;
  }

  async markRead(conversationId: string, userId: string, lastReadMessageId: string): Promise<void> {
    await this.model.updateOne(
      {
        conversationId,
        userId,
      },
      {
        $set: {
          lastReadMessageId,
        },
      },
    );
  }

  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      conversationId,
      userId,
    });

    return count > 0;
  }

  async createMany(
    participants: ConversationParticipant[],
    transaction?: TransactionContext,
  ): Promise<ConversationParticipant[]> {
    const persistenceParticipants = participants.map((participant) =>
      this.mapper.toPersistence(participant),
    );

    const docs = await this.model.insertMany(persistenceParticipants, {
      session: toMongoSession(transaction),
    });

    return docs.map((doc) => this.mapper.toDomain(doc.toObject()));
  }
}
