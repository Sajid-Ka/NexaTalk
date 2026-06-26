import { useQuery } from "@tanstack/react-query";
import {getDirectConversationsApi } from "../api/messageApi";

export function useDirectConversations() {
    return useQuery({
        queryKey: ["direct-conversations"],
        queryFn: async () => {
            const response =
                await getDirectConversationsApi();

            return response.data.data;
        },
    });
}