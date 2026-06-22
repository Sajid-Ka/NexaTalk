import { AppError } from "../../../core/errors/AppError";

export class GroupOwnerRequiredError extends AppError {
  constructor() {
    super("GROUP_OWNER_REQUIRED", "Only the group owner can perform this action", 403);
  }
}
