import { AppError } from "../../../core/errors/AppError";

export class EmptyMessageContentError extends AppError {
  constructor() {
    super("EMPTY_MESSAGE_CONTENT", "Message content cannot be empty", 400);
  }
}
