export interface MessageSenderResponse {
  id: string;
  username: string;
  avatar?: string;
}

export interface MessageItemResponse {
  id: string;
  conversationId: string;
  senderId: string;
  sender: MessageSenderResponse | null;
  content: string;
  createdAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
  isOwnMessage: boolean;
}

export interface MessagePageResponse {
  messages: MessageItemResponse[];
  nextCursor: string | null;
  hasMore: boolean;
}
