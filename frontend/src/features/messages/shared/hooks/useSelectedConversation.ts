import { useAppSelector } from "../../../../app/store";
import { useSelectedDirectConversation } from "../../direct/hooks/useSelectedDirectConversation";
import { useSelectedGroupConversation } from "../../group/hooks/useSelectedGroupConversation";

export function useSelectedConversation() {
    const directOpen = useAppSelector((state) => state.directChat.isOpen);

    const groupOpen = useAppSelector((state) => state.groupChat.isOpen);

    const directConversation = useSelectedDirectConversation();

    const groupConversation = useSelectedGroupConversation();

    if (directOpen) {
        return directConversation ?? null;
    }

    if (groupOpen) {
        return groupConversation ?? null;
    }

    return null;
}