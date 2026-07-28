import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeGroupMemberApi } from "../../shared/api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useRemoveGroupMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeGroupMemberApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}