export const MESSAGES_TYPES = {
  // repositories

  ConversationRepository: Symbol.for("ConversationRepository"),

  ConversationParticipantRepository: Symbol.for("ConversationParticipantRepository"),

  MessageRepository: Symbol.for("MessageRepository"),

  // usecases

  CreateDirectConversationUsecase: Symbol.for("CreateDirectConversationUsecase"),

  // controllers

  ConversationController: Symbol.for("ConversationController"),
} as const;
