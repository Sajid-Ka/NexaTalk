import { MessageSquare } from "lucide-react";

export default function EmptyConversationState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <MessageSquare size={28} className="text-white/30" />
            </div>

            <h2 className="text-lg font-semibold">
                No conversations yet
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
                Start chatting with your friends and your conversations will appear here.
            </p>
        </div>
    );
}