import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { transferGroupOwnershipApi } from "../../shared/api/messageApi";

export function useTransferGroupOwnership() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: transferGroupOwnershipApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}