import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupApi } from "../../shared/api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useCreateGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroupApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ConversationQuery.GROUP_CONVERSATIONS,
                ],
            });
        },
    });
}