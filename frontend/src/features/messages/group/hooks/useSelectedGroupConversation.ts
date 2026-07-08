import { useAppSelector } from "../../../../app/store";
import { useGroups } from "./useGroups";

export function useSelectedGroupConversation() {
    const { selectedConversationId } = useAppSelector(
        (state) => state.groupChat
    );

    const { data = [] } = useGroups();

    return data.find(
        (group) =>
            group.conversationId ===
            selectedConversationId
    );
}