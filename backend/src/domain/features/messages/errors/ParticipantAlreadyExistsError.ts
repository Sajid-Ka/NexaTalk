import { AppError } from "../../../core/errors/AppError";

export class ParticipantAlreadyExistsError extends AppError {
  constructor() {
    super("PARTICIPANT_ALREADY_EXISTS", "User is already a participant", 409);
  }
}
