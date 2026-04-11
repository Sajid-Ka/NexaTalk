import { AppError } from "../../../core/errors/AppError";

export class NotMemberError extends AppError {
  constructor() {
    super("NOT_MEMBER", "You are not a member of this server", 403);
  }
}
