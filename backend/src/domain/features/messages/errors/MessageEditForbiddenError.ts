import { AppError } from "../../../core/errors/AppError";

export class MessageEditForbiddenError extends AppError {
  constructor() {
    super("MESSAGE_EDIT_FORBIDDEN", "You can only edit your own messages", 403);
  }
}
