import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { addGroupMembersApi } from "../../shared/api/messageApi";

export function useAddGroupMembers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addGroupMembersApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}