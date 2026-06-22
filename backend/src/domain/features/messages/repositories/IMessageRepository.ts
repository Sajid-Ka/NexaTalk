import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Message } from "../entities/Message";

export interface IMessageRepository extends IBaseRepository<Message> {
  findByConversation(conversationId: string, limit?: number, cursor?: string): Promise<Message[]>;
}
