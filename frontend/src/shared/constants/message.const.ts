export const ConversationQuery  = {
    DIRECT_CONVERSATIONS: "direct-conversations",
    CONVERSATION_MESSAGE: "conversation",
} as const;

export type ConversationQuery = (typeof ConversationQuery)[keyof typeof ConversationQuery];