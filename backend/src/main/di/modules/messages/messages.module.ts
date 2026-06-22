import { Container } from "inversify";
import { MESSAGES_TYPES } from "./messages.types";

// repositories
import { ConversationRepository } from "../../../../infrastructure/features/messages/repositories/ConversationRepository";
import { ConversationParticipantRepository } from "../../../../infrastructure/features/messages/repositories/ConversationParticipantRepository";
import { MessageRepository } from "../../../../infrastructure/features/messages/repositories/MessageRepository";

// usecases
import { CreateDirectConversation } from "../../../../application/messages/usecases/CreateDirectConversation";

// controller
import { ConversationController } from "../../../../presentation/messages/controllers/ConversationController";

export function loadMessagesModule(container: Container) {
  // repositories

  container
    .bind(MESSAGES_TYPES.ConversationRepository)
    .to(ConversationRepository)
    .inSingletonScope();

  container
    .bind(MESSAGES_TYPES.ConversationParticipantRepository)
    .to(ConversationParticipantRepository)
    .inSingletonScope();

  container.bind(MESSAGES_TYPES.MessageRepository).to(MessageRepository).inSingletonScope();

  // usecases

  container.bind(MESSAGES_TYPES.CreateDirectConversationUsecase).to(CreateDirectConversation);

  // controller

  container.bind(MESSAGES_TYPES.ConversationController).to(ConversationController);
}
