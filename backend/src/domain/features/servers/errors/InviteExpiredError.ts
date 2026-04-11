import { AppError } from "../../../core/errors/AppError";

export class InviteExpiredError extends AppError {
  constructor() {
    super("INVITE_EXPIRED", "Invite has expired", 400);
  }
}
