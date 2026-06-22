import { AppError } from "../../../core/errors/AppError";

export class ConversationAlreadyExistsError extends AppError {
  constructor() {
    super("CONVERSATION_ALREADY_EXISTS", "Direct conversation already exists", 409);
  }
}
