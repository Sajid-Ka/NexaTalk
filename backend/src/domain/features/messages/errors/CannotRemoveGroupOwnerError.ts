import { AppError } from "../../../core/errors/AppError";

export class CannotRemoveGroupOwnerError extends AppError {
  constructor() {
    super("CANNOT_REMOVE_GROUP_OWNER", "Group owner cannot be removed", 400);
  }
}
