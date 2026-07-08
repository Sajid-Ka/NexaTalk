import { useQuery } from "@tanstack/react-query";
import { getGroupsApi } from "../../shared/api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useGroups() {
    return useQuery({
        queryKey: [
            ConversationQuery.GROUP_CONVERSATIONS,
        ],
        queryFn: async () => {
            const response = await getGroupsApi();

            return response.data.data;
        },
    });
}