import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessageApi } from "../api/messageApi";
import { ConversationQuery } from "../../../shared/constants/message.const";
import type { MessagePage } from "../types/message.types";

export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            messageId,
        }: {
            conversationId: string;
            messageId: string;
        }) => deleteMessageApi({ messageId }),

        onSuccess: async ({ data }, variables) => {
            const deletedMessage = data.data;
            const conversationId =
                deletedMessage.conversationId || variables.conversationId;

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
                            message.id === deletedMessage.id
                                ? deletedMessage
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