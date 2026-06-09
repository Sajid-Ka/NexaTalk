import { AppError } from "../../../core/errors/AppError";

export class AuthProviderNotEnabledError extends AppError {
  constructor(message: string = "This authentication provider is not enabled for your account.") {
    super("AUTH_PROVIDER_NOT_ENABLED", message, 400);
    Object.setPrototypeOf(this, AuthProviderNotEnabledError.prototype);
  }
}
