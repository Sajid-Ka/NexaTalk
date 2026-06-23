import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Message } from "../entities/Message";
import { MessagePage } from "../types/MessagePage";

export interface IMessageRepository extends IBaseRepository<Message> {
  findByConversation(conversationId: string, limit?: number, cursor?: string): Promise<MessagePage>;
  findByIds(messageIds: string[]): Promise<Message[]>;
}
