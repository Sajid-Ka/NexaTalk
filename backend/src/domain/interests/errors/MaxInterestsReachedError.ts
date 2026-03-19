import { AppError } from "../../errors/AppError";

export class MaxInterestsReachedError extends AppError {
  constructor(max: number = 20) {
    super("MAX_INTERESTS_REACHED", `You can only have up to ${max} interests`, 400);
  }
}
