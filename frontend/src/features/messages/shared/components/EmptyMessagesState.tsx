import { MessageSquare } from "lucide-react";
import EmptyState from "../../../../shared/ui/EmptyState";

export default function EmptyMessagesState() {
    return (
        <EmptyState
            icon={MessageSquare}
            title="No Messages yet"
            description="Start the conversation by sending the first message."
        />
    );
}