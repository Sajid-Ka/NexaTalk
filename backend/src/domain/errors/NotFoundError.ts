import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super("NOT_FOUND", message, 404);
  }
}
