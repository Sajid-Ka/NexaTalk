import { AppError } from "../../errors/AppError";

export class TokenExpiredError extends AppError {
  constructor() {
    super("TOKEN_EXPIRED","Token has expired", 400);
  }
}