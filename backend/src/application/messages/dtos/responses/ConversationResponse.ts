export interface ConversationResponse {
  id: string;
  type: string;
  ownerId?: string;
  name?: string;
  avatar?: string;
  participantIds: string[];
  channelId?: string;
  lastMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}
