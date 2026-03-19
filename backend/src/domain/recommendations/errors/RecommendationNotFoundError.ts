import { AppError } from "../../errors/AppError";

export class RecommendationNotFoundError extends AppError {
  constructor(userId?: string) {
    super(
      "RECOMMENDATION_NOT_FOUND",
      userId ? `No recommendations found for user ${userId}` : "Recommendations not found",
      404,
    );
  }
}
