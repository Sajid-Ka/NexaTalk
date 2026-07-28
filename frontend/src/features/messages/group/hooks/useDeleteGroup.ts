import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "../../../../app/store";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { deleteGroupApi } from "../../shared/api/messageApi";
import { closeGroupChat } from "../store/groupChatSlice";

export function useDeleteGroup() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: deleteGroupApi,
        onSuccess: () => {
            dispatch(closeGroupChat());

            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}