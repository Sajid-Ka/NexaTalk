import { injectable } from "inversify";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { ConversationModel, IConversationPersistence } from "../models/ConversationModel";
import { ConversationPersistenceMapper } from "../mappers/ConversationMapper";
import { ConversationType } from "../../../../shared/constants/conversation.const";

@injectable()
export class ConversationRepository
  extends BaseRepository<IConversationPersistence, Conversation>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel, new ConversationPersistenceMapper());
  }

  async findByDirectKey(directKey: string): Promise<Conversation | null> {
    const doc = await this.model
      .findOne({
        directKey,
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByChannelId(channelId: string): Promise<Conversation | null> {
    const doc = await this.model
      .findOne({
        type: ConversationType.CHANNEL,
        channelId,
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByParticipant(userId: string): Promise<Conversation[]> {
    const docs = await this.model
      .find({
        participantIds: userId,
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findDirectByUser(userId: string): Promise<Conversation[]> {
    const docs = await this.model
      .find({
        type: ConversationType.DIRECT,
        participantIds: userId,
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findGroupsByUser(userId: string): Promise<Conversation[]> {
    const docs = await this.model
      .find({
        type: ConversationType.GROUP,
        participantIds: userId,
      })
      .sort({
        updatedAt: -1,
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }
}
