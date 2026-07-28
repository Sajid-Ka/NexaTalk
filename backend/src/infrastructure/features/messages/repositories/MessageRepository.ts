import { injectable } from "inversify";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { Message } from "../../../../domain/features/messages/entities/Message";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { MessageModel, IMessagePersistence } from "../models/MessageModel";
import { MessagePersistenceMapper } from "../mappers/MessageMapper";
import { Types } from "mongoose";
import { MessagePage } from "../../../../domain/features/messages/types/MessagePage";
import { MessageWithSenderPage } from "../../../../domain/features/messages/types/MessageWithSenderPage";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";

@injectable()
export class MessageRepository
  extends BaseRepository<IMessagePersistence, Message>
  implements IMessageRepository
{
  private readonly messageMapper = new MessagePersistenceMapper();
  constructor() {
    super(MessageModel, new MessagePersistenceMapper());
  }

  async findByConversation(
    conversationId: string,
    limit = 20,
    cursor?: string,
    visibleToUserId?: string,
  ): Promise<MessagePage> {
    const filter: Record<string, unknown> = {
      conversationId,
    };

    if (visibleToUserId) {
      filter.hiddenForUserIds = { $ne: visibleToUserId };
    }

    if (cursor) {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const docs = await this.model
      .find(filter)
      .sort({ createdAt: 1 })
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

  async findByConversationWithSender(
    conversationId: string,
    limit = 20,
    cursor?: string,
    visibleToUserId?: string,
  ): Promise<MessageWithSenderPage> {
    const match: Record<string, unknown> = {
      conversationId,
    };

    if (visibleToUserId) {
      match.hiddenForUserIds = { $ne: visibleToUserId };
    }

    if (cursor) {
      match._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const docs = await this.model
      .aggregate([
        {
          $match: match,
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $limit: limit + 1,
        },
        {
          $lookup: {
            from: "users",
            let: {
              senderObjectId: {
                $toObjectId: "$senderId",
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$senderObjectId"],
                  },
                },
              },
              {
                $project: {
                  username: 1,
                  avatar: 1,
                },
              },
            ],
            as: "sender",
          },
        },
      ])
      .exec();

    const hasMore = docs.length > limit;
    const paginatedDocs = hasMore ? docs.slice(0, limit) : docs;

    const messages = paginatedDocs.map((doc) => this.messageMapper.toWithSenderDomain(doc));
    return {
      messages,
      nextCursor: hasMore && messages.length > 0 ? messages[messages.length - 1].message.id : null,
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

  async hideForUser(messageId: string, userId: string): Promise<Message | null> {
    const updated = await this.model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(messageId) },
        {
          $addToSet: { hiddenForUserIds: userId },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" },
      )
      .lean();

    return updated ? this.mapper.toDomain(updated) : null;
  }

  async findLatestVisibleByConversation(
    conversationId: string,
    userId: string,
  ): Promise<Message | null> {
    const doc = await this.model
      .findOne({
        conversationId,
        hiddenForUserIds: { $ne: userId },
      })
      .sort({ createdAt: -1 })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async deleteByConversation(
    conversationId: string,
    transaction?: TransactionContext,
  ): Promise<void> {
    await this.model
      .deleteMany({
        conversationId,
      })
      .session(toMongoSession(transaction) ?? null);
  }
}
