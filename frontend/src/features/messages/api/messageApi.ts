import { api } from "../../../shared/api/axios";
import type { DirectConversation } from "../types/conversation.types";
import type {
    MessagePage,
    MessageItem,
} from "../types/message.types";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

export const getDirectConversationsApi = async () => 
    api.get<ApiResponse<DirectConversation[]>>("/messages/direct");

export const createDirectConversationApi = async (targetUserId: string) => 
    api.post("/messages/direct", { targetUserId });

export const getConversationMessagesApi = async (conversationId: string, limit = 30, cursor?: string ) => 
    api.get<ApiResponse<MessagePage>>(`/messages/conversations/${conversationId}/messages`,{params: { limit, cursor,}});

export const sendMessageApi = async (conversationId: string, content: string) =>
    api.post<ApiResponse<MessageItem>>("/messages",{ conversationId, content, });

export const editMessageApi = async (messageId: string,content: string) =>
    api.patch<ApiResponse<MessageItem>>("/messages",{messageId,content,});

export const deleteMessageApi = async (messageId: string) =>
    api.delete<ApiResponse<MessageItem>>("/messages",{data: {messageId,}});

export const markConversationReadApi = async (conversationId: string,messageId: string) => 
        api.post("/messages/read",{conversationId,messageId, });

