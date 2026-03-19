import { AppError } from "./AppError";

export class ValidationError extends AppError {
  constructor(
    message: string = "Invalid request body",
    public details?: unknown,
  ) {
    super("VALIDATION_ERROR", message, 400);
  }
}
