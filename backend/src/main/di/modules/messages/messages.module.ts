import { Container } from "inversify";
import { MESSAGES_TYPES } from "./messages.types";

// repositories
import { ConversationRepository } from "../../../../infrastructure/features/messages/repositories/ConversationRepository";
import { ConversationParticipantRepository } from "../../../../infrastructure/features/messages/repositories/ConversationParticipantRepository";
import { MessageRepository } from "../../../../infrastructure/features/messages/repositories/MessageRepository";

// usecases
import { CreateDirectConversation } from "../../../../application/messages/usecases/CreateDirectConversation";
import { GetDirectConversations } from "../../../../application/messages/usecases/GetDirectConversations";
import { GetConversationMessages } from "../../../../application/messages/usecases/GetConversationMessages";
import { SendMessage } from "../../../../application/messages/usecases/SendMessage";
import { EditMessage } from "../../../../application/messages/usecases/EditMessage";
import { DeleteMessage } from "../../../../application/messages/usecases/DeleteMessage";

// controller
import { ConversationController } from "../../../../presentation/messages/controllers/ConversationController";
import { MessageController } from "../../../../presentation/messages/controllers/MessageController";
import { MarkAsRead } from "../../../../application/messages/usecases/MarkAsRead";

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
  container.bind(MESSAGES_TYPES.CreateDirectConversation).to(CreateDirectConversation);
  container.bind(MESSAGES_TYPES.GetDirectConversations).to(GetDirectConversations);
  container.bind(MESSAGES_TYPES.GetConversationMessages).to(GetConversationMessages);
  container.bind(MESSAGES_TYPES.SendMessage).to(SendMessage);
  container.bind(MESSAGES_TYPES.EditMessage).to(EditMessage);
  container.bind(MESSAGES_TYPES.DeleteMessage).to(DeleteMessage);
  container.bind(MESSAGES_TYPES.MarkAsRead).to(MarkAsRead);

  // controller
  container.bind(MESSAGES_TYPES.ConversationController).to(ConversationController);
  container.bind(MESSAGES_TYPES.MessageController).to(MessageController);
}
