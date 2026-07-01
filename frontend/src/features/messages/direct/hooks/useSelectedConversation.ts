import { useMemo } from "react";
import { useAppSelector } from "../../../../app/store";
import { useDirectConversations } from "./useDirectConversations";

export function useSelectedConversation() {
    const { selectedConversationId } = useAppSelector(
        state => state.directChat
    );

    const { data = [] } = useDirectConversations();

    return useMemo(
        () =>
            data.find(
                conversation =>
                    conversation.conversationId ===
                    selectedConversationId
            ) ?? null,
        [data, selectedConversationId]
    );
}