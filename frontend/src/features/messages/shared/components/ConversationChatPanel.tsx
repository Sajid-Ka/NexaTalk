import { useAppSelector } from "../../../../app/store";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useSelectedConversation } from "../../direct/hooks/useSelectedConversation";

export default function DirectChatPanel() {
    const { selectedConversationId } =
        useAppSelector(
            (state) => state.directChat
        );

    const conversation = useSelectedConversation();

    if (
        !conversation ||
        !selectedConversationId
    ) {
        return null;
    }

    return (
        <div className="flex h-full min-w-0 min-h-0 flex-1 flex-col bg-[#090B11]">
            <ChatHeader
                conversation={conversation}
            />

            <ChatMessages
                conversationId={
                    selectedConversationId
                }
            />

            <ChatInput
                conversationId={
                    selectedConversationId
                }
            />
        </div>
    );
}