import { AppError } from "../../../core/errors/AppError";

export class CannotLeaveAsOwnerError extends AppError {
  constructor() {
    super("CANNOT_LEAVE_AS_OWNER", "Transfer ownership before leaving the group", 400);
  }
}
