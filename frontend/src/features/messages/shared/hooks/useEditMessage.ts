import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editMessageApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import type { MessagePage } from "../types/message.types";

export function useEditMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            conversationId: string;
            messageId: string;
            content: string;
        }) =>
            editMessageApi({
                messageId: variables.messageId,
                content: variables.content,
            }),

        onSuccess: async ({ data }, variables) => {
            const updatedMessage = data.data;
            const conversationId =
                updatedMessage.conversationId || variables.conversationId;

            queryClient.setQueryData(
                [
                    ConversationQuery.CONVERSATION,
                    conversationId,
                ],
                (oldData: MessagePage | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        messages: oldData.messages.map((message) =>
                            message.id === updatedMessage.id
                                ? updatedMessage
                                : message
                        ),
                    };
                }
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [
                        ConversationQuery.CONVERSATION,
                        conversationId,
                    ],
                    refetchType: "active",
                }),
                queryClient.invalidateQueries({
                    queryKey: [
                        ConversationQuery.DIRECT_CONVERSATIONS,
                    ],
                    refetchType: "active",
                }),
            ]);
        },
    });
}