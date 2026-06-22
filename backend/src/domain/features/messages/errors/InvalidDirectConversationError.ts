import { AppError } from "../../../core/errors/AppError";

export class InvalidDirectConversationError extends AppError {
  constructor() {
    super("INVALID_DIRECT_CONVERSATION", "Cannot create a direct conversation with yourself", 400);
  }
}
