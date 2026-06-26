import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageApi } from "../api/messageApi";
import { ConversationQuery } from "../../../shared/constants/message.const";

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => sendMessageApi(conversationId, content),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [
                    ConversationQuery.CONVERSATION_MESSAGE,
                    variables.conversationId,
                ],
            });

            queryClient.invalidateQueries({
                queryKey: [
                    ConversationQuery.DIRECT_CONVERSATIONS,
                ],
            });
        },
    });
}