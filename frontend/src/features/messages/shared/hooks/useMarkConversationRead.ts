import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationReadApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useMarkConversationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markConversationReadApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ConversationQuery.DIRECT_CONVERSATIONS,
                ],
                refetchType: "active",
            });
        },
    });
}