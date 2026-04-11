import { AppError } from "../../../core/errors/AppError";

export class ServerNotFoundError extends AppError {
  constructor() {
    super("SERVER_NOT_FOUND", "Server not found", 404);
  }
}
