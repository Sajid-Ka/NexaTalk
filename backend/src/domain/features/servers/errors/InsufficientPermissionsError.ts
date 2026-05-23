import { AppError } from "../../../core/errors/AppError";

export class InsufficientPermissionsError extends AppError {
  constructor(message = "You don't have permission to perform this action") {
    super("INSUFFICIENT_PERMISSIONS", message, 403);
  }
}
