import { ConversationType } from "../../../../shared/constants/conversation.const";
import { generateDirectKey } from "../../../../shared/utils/chat/generateDirectKey";
import { normalizeParticipantIds } from "../../../../shared/utils/chat/normalizeParticipantIds";
import { Conversation } from "../entities/Conversation";

export class ConversationDomainService {
  private static generateDirectKey(userId1: string, userId2: string): string {
    return generateDirectKey(userId1, userId2);
  }

  private static normalizeParticipantIds(participantIds: string[]): string[] {
    return normalizeParticipantIds(participantIds);
  }

  static createDirectConversation(userId: string, targetUserId: string): Conversation {
    return new Conversation({
      type: ConversationType.DIRECT,
      participantIds: this.normalizeParticipantIds([userId, targetUserId]),
      directKey: this.generateDirectKey(userId, targetUserId),
    });
  }
}
