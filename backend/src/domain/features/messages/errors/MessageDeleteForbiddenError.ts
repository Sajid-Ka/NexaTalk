import { AppError } from "../../../core/errors/AppError";

export class MessageDeleteForbiddenError extends AppError {
  constructor() {
    super("MESSAGE_DELETE_FORBIDDEN", "You can only delete your own messages", 403);
  }
}
