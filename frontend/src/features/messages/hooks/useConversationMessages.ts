import { useQuery } from "@tanstack/react-query";
import { getConversationMessagesApi } from "../api/messageApi";
import { ConversationQuery } from "../../../shared/constants/message.const";

export function useConversationMessages(
    conversationId: string | null
) {
    return useQuery({
        queryKey: [
            ConversationQuery.CONVERSATION_MESSAGE,
            conversationId,
        ],
        enabled: !!conversationId,
        queryFn: async () => {
            const response =
                await getConversationMessagesApi(
                    conversationId!
                );

            return response.data.data;
        },
    });
}