export const MESSAGES_TYPES = {
  // repositories
  ConversationRepository: Symbol.for("ConversationRepository"),
  ConversationParticipantRepository: Symbol.for("ConversationParticipantRepository"),
  MessageRepository: Symbol.for("MessageRepository"),

  // usecases
  CreateDirectConversation: Symbol.for("CreateDirectConversationUsecase"),
  GetDirectConversations: Symbol.for("GetDirectConversations"),
  GetConversationMessages: Symbol.for("GetConversationMessages"),
  SendMessage: Symbol.for("SendMessage"),
  EditMessage: Symbol.for("EditMessage"),
  DeleteMessage: Symbol.for("DeleteMessage"),
  MarkAsRead: Symbol.for("MarkAsRead"),

  // controllers
  ConversationController: Symbol.for("ConversationController"),
  MessageController: Symbol.for("MessageController"),
} as const;
