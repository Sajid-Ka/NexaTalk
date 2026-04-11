import { AppError } from "../../../core/errors/AppError";

export class InviteMaxUsesReachedError extends AppError {
  constructor() {
    super("INVITE_MAX_USES_REACHED", "Invite has reached its maximum number of uses", 400);
  }
}
