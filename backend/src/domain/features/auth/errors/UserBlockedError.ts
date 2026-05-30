import { AppError } from "../../../core/errors/AppError";

export class UserBlockedError extends AppError {
  constructor(reason?: string | null) {
    const message = reason
      ? `Your account is blocked. Reason: ${reason}`
      : "Your account is blocked. Please contact support.";

    super("USER_BLOCKED", message, 403);
  }
}
