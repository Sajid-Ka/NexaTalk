import { AppError } from "../../../core/errors/AppError";

export class MessageNotFoundError extends AppError {
  constructor() {
    super("MESSAGE_NOT_FOUND", "Message not found", 404);
  }
}
