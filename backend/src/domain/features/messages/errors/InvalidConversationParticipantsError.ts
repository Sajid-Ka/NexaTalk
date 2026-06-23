import { AppError } from "../../../core/errors/AppError";

export class InvalidConversationParticipantsError extends AppError {
  constructor() {
    super("INVALID_CONVERSATION_PARTICIPANTS", "Conversation has invalid participants", 400);
  }
}
