import { AppError } from "../../../core/errors/AppError";
import { ServerValidation } from "../../../../shared/constants/server.const";

export class ServerTagsLimitExceededError extends AppError {
  constructor() {
    super(
      "SERVER_TAGS_LIMIT_EXCEEDED",
      `Cannot have more than ${ServerValidation.MAX_TAGS} tags`,
      400,
    );
  }
}
