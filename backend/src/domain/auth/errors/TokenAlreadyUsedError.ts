import { AppError } from "../../errors/AppError";

export class TokenAlreadyUsedError extends AppError {
  constructor() {
    super("TOKEN_ALREADY_USED", "Token already used", 400);
  }
}
