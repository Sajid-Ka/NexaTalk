import { AppError } from "../../errors/AppError";

export class ConflictError extends AppError {
  constructor() {
    super("Email alredy registered", 409);
  }
}
