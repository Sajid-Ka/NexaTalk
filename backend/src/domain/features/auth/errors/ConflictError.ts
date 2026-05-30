import { AppError } from "../../../core/errors/AppError";

export class ConflictError extends AppError {
  constructor(
    code: string = "EMAIL_ALREADY_REGISTERED",
    message: string = "Email already registered",
  ) {
    super(code, message, 409);
  }
}
