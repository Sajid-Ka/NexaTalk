import { useState } from "react";
import Input from "../../../shared/ui/Input";
import { useAppDispatch } from "../../../app/store";
import { stopEditingMessage } from "../store/messageEditingSlice";
import { useEditMessage } from "../hooks/useEditMessage";
import type { MessageItem } from "../types/message.types";

interface EditableMessageContentProps {
    message: MessageItem;
}

export default function EditableMessageContent({
    message,
}: EditableMessageContentProps) {
    const dispatch = useAppDispatch();

    const [value, setValue] = useState(message.content);

    const { mutate: editMessage } = useEditMessage();

    const handleSave = () => {
        const content = value.trim();

        if (!content) {
            return;
        }

        editMessage(
            {
                conversationId:
                    message.conversationId,
                messageId: message.id,
                content,
            },
            {
                onSuccess: () => {
                    dispatch(
                        stopEditingMessage()
                    );
                },
            }
        );
    };

    return (
        <div className="space-y-3">
            <Input
                autoFocus
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        dispatch(stopEditingMessage());
                    }

                    if (
                        e.key === "Enter" &&
                        !e.shiftKey
                    ) {
                        e.preventDefault();
                        handleSave();
                    }
                }}
            />

            <div className="flex justify-end gap-2">
                <button
                    onClick={() =>
                        dispatch(
                            stopEditingMessage()
                        )
                    }
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
                >
                    Cancel
                </button>

                <button
                    onClick={handleSave}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs hover:bg-indigo-500"
                >
                    Save
                </button>
            </div>
        </div>
    );
}