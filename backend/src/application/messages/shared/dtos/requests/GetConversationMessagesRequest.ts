export interface GetConversationMessagesRequest {
  conversationId: string;
  limit?: number;
  cursor?: string;
}
