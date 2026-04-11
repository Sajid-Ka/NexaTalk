import { AppError } from "../../../core/errors/AppError";

export class AlreadyMemberError extends AppError {
  constructor() {
    super("ALREADY_MEMBER", "You are already a member of this server", 400);
  }
}
