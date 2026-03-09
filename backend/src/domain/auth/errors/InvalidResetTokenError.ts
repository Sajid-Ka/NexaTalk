import { AppError } from "../../errors/AppError";

export class InvalidResetTokenError extends AppError {
    constructor() {
        super("INVALID_RESET_TOKEN","Invalid or expired reset token",400);
    }
}