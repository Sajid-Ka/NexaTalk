import { AppError } from "../../../core/errors/AppError";

export class CannotRemoveOwnerError extends AppError {
  constructor() {
    super("CANNOT_REMOVE_OWNER", "Cannot remove the server owner", 400);
  }
}
