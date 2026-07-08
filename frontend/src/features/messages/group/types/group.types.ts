export interface GroupConversation {
    conversationId: string;
    ownerId: string;
    name: string;
    avatar?: string;
    participantIds: string[];
    lastMessage?: string;
    updatedAt: Date;
}