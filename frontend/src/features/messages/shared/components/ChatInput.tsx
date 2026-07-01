import { useState } from "react";
import { Send } from "lucide-react";
import Input from "../../../../shared/ui/Input";
import { useSendMessage } from "../hooks/useSendMessage";

interface ChatInputProps {
    conversationId: string;
}

export default function ChatInput({
    conversationId,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const { mutate: sendMessage, isPending } = useSendMessage();

    const handleSend = () => {
        const value = message.trim();
        if (!value) return;

        sendMessage(
            {
                conversationId,
                content: value,
            },
            {
                onSuccess: () => {
                    setMessage("");
                }
            }
        )
    };

    return (
        <div className="border-t border-white/5 bg-[#090B11] p-4">
            <div className="flex gap-3">
                <Input
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder="Message..."
                />

                <button
                    disabled={isPending}
                    onClick={handleSend}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 transition hover:bg-indigo-500"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}