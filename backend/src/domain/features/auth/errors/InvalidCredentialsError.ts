import { AppError } from "../../../core/errors/AppError";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }
}
