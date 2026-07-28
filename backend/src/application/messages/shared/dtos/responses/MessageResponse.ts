export interface MessageSenderResponse {
  id: string;
  username: string;
  avatar?: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessageSenderResponse | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
  isOwnMessage: boolean;
}
