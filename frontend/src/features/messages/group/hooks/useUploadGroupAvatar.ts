import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { uploadGroupAvatarApi } from "../../shared/api/messageApi";

export function useUploadGroupAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadGroupAvatarApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}