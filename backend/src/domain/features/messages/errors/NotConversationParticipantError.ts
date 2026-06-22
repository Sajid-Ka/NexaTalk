import { AppError } from "../../../core/errors/AppError";

export class NotConversationParticipantError extends AppError {
  constructor() {
    super("NOT_CONVERSATION_PARTICIPANT", "User is not a participant of this conversation", 403);
  }
}
