export interface MessageSender {
    id: string;
    username: string;
    avatar?: string;
}

export interface MessageItem {
    id: string;
    senderId: string;
    sender: MessageSender | null;
    content: string;
    createdAt: Date;
    editedAt: Date | null;
    deletedAt: Date | null;
    isOwnMessage: boolean;
    conversationId: string;
}

export interface MessagePage {
    messages: MessageItem[];
    nextCursor: string | null;
    hasMore: boolean;
}

export interface SendMessagePayload {
    conversationId: string;
    content: string;
}

export interface EditMessagePayload {
    messageId: string;
    content: string;
}

export interface DeleteMessagePayload {
    messageId: string;
}