import { AppError } from "../../../core/errors/AppError";

export class ConversationNotFoundError extends AppError {
  constructor() {
    super("CONVERSATION_NOT_FOUND", "Conversation not found", 404);
  }
}
