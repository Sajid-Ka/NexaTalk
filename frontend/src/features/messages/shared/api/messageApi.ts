import { api } from "../../../../shared/api/axios";
import type { DirectConversation } from "../../direct/types/conversation.types";
import type { GroupConversation } from "../../group/types/group.types";
import type {
    MessagePage,
    MessageItem,
} from "../types/message.types";

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

//Direct conversation api
export const getDirectConversationsApi = async () =>
    api.get<ApiResponse<DirectConversation[]>>("/messages/direct");

export const createDirectConversationApi = async (targetUserId: string) =>
    api.post("/messages/direct", { targetUserId });

//Group apis
export const getGroupsApi = async () =>
    api.get<ApiResponse<GroupConversation[]>>("/messages/groups");

export const createGroupApi = async ({name, avatar, participantIds,}: {name: string; avatar?: string; participantIds: string[];}) =>
    api.post<ApiResponse<GroupConversation>>("/messages/groups", {name, avatar, participantIds});

//common apis
export const getConversationMessagesApi = async (conversationId: string, limit = 30, cursor?: string) =>
    api.get<ApiResponse<MessagePage>>(`/messages/conversations/${conversationId}/messages`, { params: { limit, cursor, t: new Date().getTime() } });

export const sendMessageApi = async ({ conversationId, content }: { conversationId: string; content: string; }) =>
    api.post<ApiResponse<MessageItem>>("/messages", { conversationId, content });

export const editMessageApi = async ({ messageId, content }: { messageId: string; content: string; }) =>
    api.patch<ApiResponse<MessageItem>>("/messages", { messageId, content });

export const deleteMessageApi = async ({ messageId, }: { messageId: string; }) =>
    api.delete<ApiResponse<MessageItem>>("/messages", { data: { messageId, } });

export const markConversationReadApi = async ({ conversationId, messageId }: { conversationId: string; messageId: string; }) =>
    api.post("/messages/read", { conversationId, messageId });