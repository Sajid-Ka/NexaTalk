import { ConversationType } from "../../../../shared/constants/conversation.const";
import { generateDirectKey } from "../../../../shared/utils/chat/generateDirectKey";
import { normalizeParticipantIds } from "../../../../shared/utils/chat/normalizeParticipantIds";
import { Conversation } from "../entities/Conversation";
import { InvalidConversationParticipantsError } from "../errors/InvalidConversationParticipantsError";
import { InvalidMessageContentError } from "../errors/InvalidMessageContentError";

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

  static getDirectTargetUserId(conversation: Conversation, currentUserId: string): string {
    const targetUserId = conversation.participantIds.find((id) => id !== currentUserId);

    if (!targetUserId) {
      throw new InvalidConversationParticipantsError();
    }

    return targetUserId;
  }

  static validateMessageContent(content: string): void {
    const value = content.trim();

    if (!value) {
      throw new InvalidMessageContentError();
    }

    if (value.length > 4000) {
      throw new InvalidMessageContentError();
    }
  }
}
