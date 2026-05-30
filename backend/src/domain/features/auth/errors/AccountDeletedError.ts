import { AppError } from "../../../core/errors/AppError";

export class AccountDeletedError extends AppError {
  constructor() {
    super(
      "ACCOUNT_DELETED",
      "This account is no longer available. Please contact support for assistance.",
      403,
    );
  }
}
