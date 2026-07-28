import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { renameGroupApi } from "../../shared/api/messageApi";

export function useRenameGroup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: renameGroupApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}