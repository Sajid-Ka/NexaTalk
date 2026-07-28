export const ConversationQuery = {
  DIRECT_CONVERSATIONS: "direct-conversations",
  GROUP_CONVERSATIONS: "group-conversations",
  CHANNEL_CONVERSATION: "channel-conversation",
  CONVERSATION: "conversation",
} as const;

export type ConversationQuery = (typeof ConversationQuery)[keyof typeof ConversationQuery];
