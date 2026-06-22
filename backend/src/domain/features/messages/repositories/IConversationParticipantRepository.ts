import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ConversationParticipant } from "../entities/ConversationParticipant";
import { TransactionContext } from "../../../core/common/services/TransactionContext";

export interface IConversationParticipantRepository extends IBaseRepository<ConversationParticipant> {
  removeParticipant(conversationId: string, userId: string): Promise<boolean>;
  findParticipant(conversationId: string, userId: string): Promise<ConversationParticipant | null>;
  getParticipants(conversationId: string): Promise<ConversationParticipant[]>;
  markRead(conversationId: string, userId: string, lastReadMessageId: string): Promise<void>;
  isParticipant(conversationId: string, userId: string): Promise<boolean>;
  createMany(
    participants: ConversationParticipant[],
    transaction?: TransactionContext,
  ): Promise<ConversationParticipant[]>;
}
