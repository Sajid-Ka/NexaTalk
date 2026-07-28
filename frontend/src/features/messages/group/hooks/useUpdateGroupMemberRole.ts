import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupMemberRoleApi } from "../../shared/api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";

export function useUpdateGroupMemberRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateGroupMemberRoleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}