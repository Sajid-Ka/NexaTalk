import { AppError } from "../../errors/AppError";

export class ConflictError extends AppError {
  constructor() {
    super("EMAIL_ALREADY_REGISTERED", "Email already registered", 409);
  }
}
