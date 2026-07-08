import GroupConversationList from "../components/GroupConversationList";
import ConversationChatPanel from "../../shared/components/ConversationChatPanel";
import { useAppSelector } from "../../../../app/store";

export default function GroupMessagesPage() {
    const { isOpen } = useAppSelector(
        (state) => state.groupChat
    );

    return (
        <>
            <GroupConversationList />

            {isOpen && (
                <ConversationChatPanel />
            )}
        </>
    );
}