import { AppError } from "../../../core/errors/AppError";

export class InterestNotFoundError extends AppError {
  constructor(interestId?: string) {
    super(
      "INTEREST_NOT_FOUND",
      interestId ? `Interest with ID ${interestId} not found` : "Interest not found",
      404,
    );
  }
}
