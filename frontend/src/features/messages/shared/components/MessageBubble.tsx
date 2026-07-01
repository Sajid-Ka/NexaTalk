import { cn } from "../../../../shared/utils/cn";
import type { MessageItem } from "../types/message.types";
import { useState } from "react";
import MessageActions from "./MessageActions";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import {
    startEditingMessage,
} from "../store/messageEditingSlice";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import EditableMessageContent from "./EditableMessageContent";

interface MessageBubbleProps {
    message: MessageItem;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const dispatch = useAppDispatch();
    const editingMessageId = useAppSelector((state) => state.messageEditing.editingMessageId);
    const isEditing = editingMessageId === message.id;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { mutate: deleteMessage, isPending: deleting } = useDeleteMessage();

    return (
        <>
            <div
                className={cn(
                    "flex w-full",
                    message.isOwnMessage
                        ? "justify-end"
                        : "justify-start"
                )}
            >
                <div
                    className={cn(
                        "group relative max-w-[70%] rounded-2xl px-4 py-3",
                        message.isOwnMessage
                            ? "bg-indigo-600"
                            : "bg-white/5"
                    )}
                >
                    {isEditing ? (
                        <EditableMessageContent
                            message={message}
                        />
                    ) : (
                        <p className="break-words text-sm">
                            {message.deletedAt ? (
                                <span className="italic text-white/40">
                                    This message was deleted.
                                </span>
                            ) : (
                                message.content
                            )}
                        </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex gap-1 text-[10px] text-white/40">
                            {message.editedAt && (
                                <span>edited</span>
                            )}

                            <span>
                                {new Date(
                                    message.createdAt
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>

                        {message.isOwnMessage &&
                            !message.deletedAt &&
                            !isEditing && (
                                <div className="absolute -right-2 -top-2 opacity-0 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto">
                                    <MessageActions
                                        onEdit={() =>
                                            dispatch(
                                                startEditingMessage(
                                                    message.id
                                                )
                                            )
                                        }
                                        onDelete={() =>
                                            setDeleteOpen(true)
                                        }
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <DeleteMessageDialog
                open={deleteOpen}
                loading={deleting}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={() => {
                    deleteMessage(
                        {
                            conversationId:
                                message.conversationId,
                            messageId: message.id,
                        },
                        {
                            onSuccess: () => {
                                setDeleteOpen(false);
                            },
                        }
                    );
                }}
            />
        </>
    );
}

