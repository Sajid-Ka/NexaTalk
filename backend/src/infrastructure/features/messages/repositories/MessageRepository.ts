import { injectable } from "inversify";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { Message } from "../../../../domain/features/messages/entities/Message";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { MessageModel, IMessagePersistence } from "../models/MessageModel";
import { MessagePersistenceMapper } from "../mappers/MessageMapper";
import { Types } from "mongoose";
import { MessagePage } from "../../../../domain/features/messages/types/MessagePage";

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
  ): Promise<MessagePage> {
    const filter: Record<string, unknown> = {
      conversationId,
    };

    if (cursor) {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const docs = await this.model
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;

    const paginatedDocs = hasMore ? docs.slice(0, limit) : docs;

    const messages = paginatedDocs.map((doc) => this.mapper.toDomain(doc));

    return {
      messages,
      nextCursor: hasMore && messages.length > 0 ? messages[messages.length - 1].id : null,
      hasMore,
    };
  }

  async findByIds(messageIds: string[]): Promise<Message[]> {
    if (messageIds.length === 0) {
      return [];
    }

    const objectIds = messageIds.map((id) => new Types.ObjectId(id));

    const docs = await this.model
      .find({
        _id: {
          $in: objectIds,
        },
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }
}
