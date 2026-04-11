import { AppError } from "../../../core/errors/AppError";

export class InviteInvalidError extends AppError {
  constructor() {
    super("INVITE_INVALID", "Invite is invalid", 400);
  }
}
