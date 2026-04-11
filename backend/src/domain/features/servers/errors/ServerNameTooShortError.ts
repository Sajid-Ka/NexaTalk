import { AppError } from "../../../core/errors/AppError";
import { ServerValidation } from "../../../../shared/constants/server.const";

export class ServerNameTooShortError extends AppError {
  constructor() {
    super(
      "SERVER_NAME_TOO_SHORT",
      `Server name must be at least ${ServerValidation.MIN_NAME_LENGTH} characters`,
      400,
    );
  }
}
