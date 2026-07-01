import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import { useAppDispatch } from "../../../../app/store";
import { createDirectConversationApi } from "../../shared/api/messageApi";
import { openDirectChat } from "../store/directChatSlice";
import { setHomeTab } from "../../../home/store/homeNavigationSlice";
import { closeProfileDrawer } from "../../../users/store/userProfileDrawerSlice";
import { HomeTab } from "../../../../shared/constants/homeTab.const";

export function useOpenDirectConversation() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createDirectConversationApi,

        onSuccess: async ({ data }) => {
            await queryClient.invalidateQueries({
                queryKey: [ConversationQuery.DIRECT_CONVERSATIONS],
            });

            dispatch(closeProfileDrawer());

            dispatch(setHomeTab(HomeTab.DIRECTMESSAGES));

            dispatch(openDirectChat(data.data.id));
        },
    });
}