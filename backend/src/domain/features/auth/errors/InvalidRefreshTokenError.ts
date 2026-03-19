import { AppError } from "../../../core/errors/AppError";

export class InvalidRefreshTokenError extends AppError {
  constructor() {
    super("INVALID_REFRESH_TOKEN", "Invalid or expired refresh token", 401);
  }
}
