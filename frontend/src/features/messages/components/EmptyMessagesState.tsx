import { MessageSquare } from "lucide-react";

export default function EmptyMessagesState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <MessageSquare
                size={40}
                className="mb-4 text-white/20"
            />

            <h2 className="text-lg font-semibold">
                No messages yet
            </h2>

            <p className="mt-2 text-sm text-white/40">
                Start the conversation by sending the first message.
            </p>
        </div>
    );
}