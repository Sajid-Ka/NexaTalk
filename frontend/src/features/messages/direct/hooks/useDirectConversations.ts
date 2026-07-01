import { useQuery } from "@tanstack/react-query";
import { getDirectConversationsApi } from "../../shared/api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useDirectConversations() {
    return useQuery({
        queryKey: [ConversationQuery.DIRECT_CONVERSATIONS],
        queryFn: async () => {
            const response =
                await getDirectConversationsApi();

            return response.data.data;
        },
    });
}