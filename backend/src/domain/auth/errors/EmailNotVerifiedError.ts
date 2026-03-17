import { AppError } from "../../errors/AppError";

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super("EMAIL_NOT_VERIFIED", "Email is not verified", 403);
  }
}
