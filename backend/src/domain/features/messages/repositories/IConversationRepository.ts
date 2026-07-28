import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Conversation } from "../entities/Conversation";

export interface IConversationRepository extends IBaseRepository<Conversation> {
  findByDirectKey(directKey: string): Promise<Conversation | null>;
  findByChannelId(channelId: string): Promise<Conversation | null>;
  findByParticipant(userId: string): Promise<Conversation[]>;
  findDirectByUser(userId: string): Promise<Conversation[]>;
  findGroupsByUser(userId: string): Promise<Conversation[]>;
}
