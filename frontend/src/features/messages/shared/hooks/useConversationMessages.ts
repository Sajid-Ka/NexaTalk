import { useQuery } from "@tanstack/react-query";
import { getConversationMessagesApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useConversationMessages(conversationId: string | null) {
    return useQuery({
        queryKey: [
            ConversationQuery.CONVERSATION,
            conversationId,
        ],
        enabled: Boolean(conversationId),
        queryFn: async () => {
            const response = await getConversationMessagesApi(
                conversationId!
            );

            return response.data.data;
        },
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnMount: false,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}