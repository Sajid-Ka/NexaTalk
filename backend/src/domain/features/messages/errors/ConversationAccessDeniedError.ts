import { AppError } from "../../../core/errors/AppError";

export class ConversationAccessDeniedError extends AppError {
  constructor() {
    super("CONVERSATION_ACCESS_DENIED", "You are not a participant of this conversation", 403);
  }
}
