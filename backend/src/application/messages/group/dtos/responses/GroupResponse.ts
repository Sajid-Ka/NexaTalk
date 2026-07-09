export interface GroupResponse {
  conversationId: string;
  name: string;
  avatar?: string;
  ownerId: string;
  participantIds: string[];
  createdAt: Date;
}
