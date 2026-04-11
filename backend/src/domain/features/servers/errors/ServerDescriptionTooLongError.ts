import { AppError } from "../../../core/errors/AppError";
import { ServerValidation } from "../../../../shared/constants/server.const";

export class ServerDescriptionTooLongError extends AppError {
  constructor() {
    super(
      "SERVER_DESCRIPTION_TOO_LONG",
      `Server description must be at most ${ServerValidation.MAX_DESCRIPTION_LENGTH} characters`,
      400,
    );
  }
}
