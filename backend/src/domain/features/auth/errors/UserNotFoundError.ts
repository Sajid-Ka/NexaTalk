import { AppError } from "../../../core/errors/AppError";

export class UserNotFoundError extends AppError {
  constructor(userId?: string) {
    super("USER_NOT_FOUND", userId ? `User not found: ${userId}` : "User not found", 404);
  }
}
