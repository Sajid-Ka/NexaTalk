import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "../../../../app/store";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { leaveGroupApi } from "../../shared/api/messageApi";
import { closeGroupChat } from "../store/groupChatSlice";

export function useLeaveGroup() {
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: leaveGroupApi,
        onSuccess: () => {
            dispatch(closeGroupChat());

            queryClient.invalidateQueries({
                queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
            });
        },
    });
}