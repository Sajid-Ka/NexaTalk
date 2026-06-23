import { AppError } from "../../../core/errors/AppError";

export class InvalidMessageContentError extends AppError {
  constructor() {
    super("INVALID_MESSAGE_CONTENT", "Message content is invalid", 400);
  }
}
