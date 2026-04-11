import { AppError } from "../../../core/errors/AppError";
import { ServerValidation } from "../../../../shared/constants/server.const";

export class ServerNameTooLongError extends AppError {
  constructor() {
    super(
      "SERVER_NAME_TOO_LONG",
      `Server name must be at most ${ServerValidation.MAX_NAME_LENGTH} characters`,
      400,
    );
  }
}
