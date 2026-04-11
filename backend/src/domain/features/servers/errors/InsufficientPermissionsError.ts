import { AppError } from "../../../core/errors/AppError";

export class InsufficientPermissionsError extends AppError {
  constructor() {
    super("INSUFFICIENT_PERMISSIONS", "You don't have permission to perform this action", 403);
  }
}
