import { useQuery } from "@tanstack/react-query";
import { getConversationMessagesApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useConversationMessages(conversationId: string | null) {
    return useQuery({
        queryKey: [
            ConversationQuery.CONVERSATION,
            conversationId,
        ],
        enabled: !!conversationId,
        queryFn: async () => {
            const response = await getConversationMessagesApi(
                conversationId!
            );

            return response.data.data;
        },

        refetchInterval: conversationId ? 1500 : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
    });
}