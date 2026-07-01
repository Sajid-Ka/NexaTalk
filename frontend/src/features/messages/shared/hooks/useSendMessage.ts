import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import type { MessagePage } from "../types/message.types";

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => sendMessageApi({ conversationId, content }),

        onSuccess: ({ data }, variables) => {
            queryClient.setQueryData(
                [
                    ConversationQuery.CONVERSATION,
                    variables.conversationId,
                ],
                (oldData: MessagePage | undefined) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        messages: [
                            ...oldData.messages,
                            data.data,
                        ],
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: [
                    ConversationQuery.DIRECT_CONVERSATIONS,
                ],
            });
        }
    });
}