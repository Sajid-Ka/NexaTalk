export interface MessageItemResponse {
  id: string;
  senderId: string;
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
