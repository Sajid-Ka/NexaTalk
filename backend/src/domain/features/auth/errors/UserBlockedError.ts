import { AppError } from "../../../core/errors/AppError";

export class UserBlockedError extends AppError {
  constructor(message: string = "Account is blocked or deleted") {
    super("USER_BLOCKED", message, 403);
  }
}
