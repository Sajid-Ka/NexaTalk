import { injectable } from "inversify";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { Message } from "../../../../domain/features/messages/entities/Message";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { MessageModel, IMessagePersistence } from "../models/MessageModel";
import { MessagePersistenceMapper } from "../mappers/MessageMapper";
import { Types } from "mongoose";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessagePersistence, Message>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel, new MessagePersistenceMapper());
  }

  async findByConversation(
    conversationId: string,
    limit = 20,
    cursor?: string,
  ): Promise<Message[]> {
    const filter: Record<string, unknown> = {
      conversationId,
    };

    if (cursor) {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const docs = await this.model.find(filter).sort({ createdAt: -1 }).limit(limit).lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }
}
