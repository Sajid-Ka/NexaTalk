import { api } from "../../../../shared/api/axios";
import type { DirectConversation } from "../../direct/types/conversation.types";
import type { GroupConversation } from "../../group/types/group.types";
import type {
    MessagePage,
    MessageItem,
} from "../types/message.types";
import { GroupRole } from "../../../../shared/constants/group-role.const";

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

export const createGroupApi = async ({
    name,
    participantIds,
}: {
    name: string;
    participantIds: string[];
}) =>
    api.post<ApiResponse<GroupConversation>>("/messages/groups", {
        name,
        participantIds,
    });

export const updateGroupMemberRoleApi = async ({
    conversationId,
    userId,
    role,
}: {
    conversationId: string;
    userId: string;
    role: GroupRole;
}) =>
    api.patch<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}/members/${userId}/role`,{ role });

export const removeGroupMemberApi = async ({
    conversationId,
    userId,
}: {
    conversationId: string;
    userId: string;
}) =>
    api.delete<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}/members/${userId}`
    );

export const leaveGroupApi = async (conversationId: string) =>
    api.post<ApiResponse<null>>(`/messages/groups/${conversationId}/leave`);

export const transferGroupOwnershipApi = async ({
    conversationId,
    newOwnerId,
}: {
    conversationId: string;
    newOwnerId: string;
}) =>
    api.post<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}/transfer-owner`,
        { newOwnerId }
    );

export const addGroupMembersApi = async ({
    conversationId,
    participantIds,
}: {
    conversationId: string;
    participantIds: string[];
}) =>
    api.post<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}/members`,
        { participantIds }
    );

export const uploadGroupAvatarApi = async ({
    conversationId,
    file,
}: {
    conversationId: string;
    file: File;
}) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api.post<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};

export const renameGroupApi = async ({
    conversationId,
    name,
}: {
    conversationId: string;
    name: string;
}) =>
    api.patch<ApiResponse<GroupConversation>>(
        `/messages/groups/${conversationId}`,
        { name }
    );

export const deleteGroupApi = async (conversationId: string) =>
    api.delete<ApiResponse<null>>(`/messages/groups/${conversationId}`);

//common apis
export const getConversationMessagesApi = async (conversationId: string, limit = 30, cursor?: string) =>
    api.get<ApiResponse<MessagePage>>(`/messages/conversations/${conversationId}/messages`, {params: {limit, cursor,}});

export const sendMessageApi = async ({ conversationId, content }: { conversationId: string; content: string; }) =>
    api.post<ApiResponse<MessageItem>>("/messages", { conversationId, content });

export const editMessageApi = async ({ messageId, content }: { messageId: string; content: string; }) =>
    api.patch<ApiResponse<MessageItem>>("/messages", { messageId, content });

export const deleteMessageForMeApi = async ({ messageId }: { messageId: string }) =>
    api.delete<ApiResponse<null>>("/messages/for-me", { data: { messageId } });

export const deleteMessageApi = async ({ messageId, }: { messageId: string; }) =>
    api.delete<ApiResponse<MessageItem>>("/messages", { data: { messageId, } });

export const markConversationReadApi = async ({ conversationId, messageId }: { conversationId: string; messageId: string; }) =>
    api.post("/messages/read", { conversationId, messageId });