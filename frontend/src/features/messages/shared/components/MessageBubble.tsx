import { useState } from "react";
import { cn } from "../../../../shared/utils/cn";
import type { MessageItem } from "../types/message.types";
import MessageActions from "./MessageActions";
import { useAppDispatch, useAppSelector } from "../../../../app/store";
import { startEditingMessage } from "../store/messageEditingSlice";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { useDeleteMessage } from "../hooks/useDeleteMessage";
import EditableMessageContent from "./EditableMessageContent";
import { useDeleteMessageForMe } from "../hooks/useDeleteMessageForMe";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { useSelectedGroupConversation } from "../../group/hooks/useSelectedGroupConversation";

interface MessageBubbleProps {
  message: MessageItem;
  isDirectConversation: boolean;
  showSenderInfo?: boolean;
}

export default function MessageBubble({
  message,
  isDirectConversation,
  showSenderInfo = false,
}: MessageBubbleProps) {
  const dispatch = useAppDispatch();
  const editingMessageId = useAppSelector((state) => state.messageEditing.editingMessageId);

  const isEditing = editingMessageId === message.id;
  const hasActions = !message.deletedAt && !isEditing;

  const [deleteForEveryoneOpen, setDeleteForEveryoneOpen] = useState(false);
  const [deleteForMeOpen, setDeleteForMeOpen] = useState(false);

  const { mutate: deleteMessage, isPending: deletingForEveryone } = useDeleteMessage();

  const { mutate: deleteMessageForMe, isPending: deletingForMe } = useDeleteMessageForMe();

  const selectedGroup = useSelectedGroupConversation();

  const canModerateGroupMessages =
    !isDirectConversation &&
    (selectedGroup?.currentUserRole === GroupRole.OWNER ||
      selectedGroup?.currentUserRole === GroupRole.ADMIN);

  const canDeleteForEveryone =
    message.isOwnMessage || canModerateGroupMessages;

  return (
    <>
      <div className={cn("flex w-full", message.isOwnMessage ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "group relative max-w-[70%] rounded-2xl px-4 py-3",
            message.isOwnMessage ? "bg-indigo-600" : "bg-white/5",
          )}
        >
          {showSenderInfo && !message.isOwnMessage && message.sender && (
            <div className="mb-1 text-xs font-semibold text-indigo-300">
              {message.sender.username}
            </div>
          )}
          {isEditing ? (
            <EditableMessageContent message={message} />
          ) : (
            <p className="break-words text-sm">
              {message.deletedAt ? (
                <span className="italic text-white/40">This message was deleted.</span>
              ) : (
                message.content
              )}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-1 text-[10px] text-white/40">
              {message.editedAt && <span>edited</span>}

              <span>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {hasActions && (
              <div className="absolute -right-2 -top-2 opacity-0 pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto">
                <MessageActions
                  onEdit={
                    message.isOwnMessage
                      ? () => dispatch(startEditingMessage(message.id))
                      : undefined
                  }
                  onDeleteForMe={() => setDeleteForMeOpen(true)}
                  onDeleteForEveryone={
                    canDeleteForEveryone ? () => setDeleteForEveryoneOpen(true) : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteMessageDialog
        open={deleteForEveryoneOpen}
        loading={deletingForEveryone}
        onCancel={() => setDeleteForEveryoneOpen(false)}
        onConfirm={() => {
          deleteMessage(
            {
              conversationId: message.conversationId,
              messageId: message.id,
            },
            {
              onSuccess: () => setDeleteForEveryoneOpen(false),
            },
          );
        }}
      />

      <DeleteMessageDialog
        open={deleteForMeOpen}
        loading={deletingForMe}
        title="Delete for you?"
        description="This message will be removed from your chat only. Other participants can still see it."
        confirmLabel="Delete for me"
        onCancel={() => setDeleteForMeOpen(false)}
        onConfirm={() => {
          deleteMessageForMe(
            {
              conversationId: message.conversationId,
              messageId: message.id,
            },
            {
              onSuccess: () => setDeleteForMeOpen(false),
            },
          );
        }}
      />
    </>
  );
}
