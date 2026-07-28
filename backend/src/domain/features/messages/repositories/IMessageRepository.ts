import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Message } from "../entities/Message";
import { MessagePage } from "../types/MessagePage";
import { MessageWithSenderPage } from "../types/MessageWithSenderPage";
import { TransactionContext } from "../../../core/common/services/TransactionContext";

export interface IMessageRepository extends IBaseRepository<Message> {
  findByConversation(
    conversationId: string,
    limit?: number,
    cursor?: string,
    visibleToUserId?: string,
  ): Promise<MessagePage>;

  findByConversationWithSender(
    conversationId: string,
    limit?: number,
    cursor?: string,
    visibleToUserId?: string,
  ): Promise<MessageWithSenderPage>;

  findByIds(messageIds: string[]): Promise<Message[]>;
  hideForUser(messageId: string, userId: string): Promise<Message | null>;
  findLatestVisibleByConversation(conversationId: string, userId: string): Promise<Message | null>;
  deleteByConversation(conversationId: string, transaction?: TransactionContext): Promise<void>;
}
