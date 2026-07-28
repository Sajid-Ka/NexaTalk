import { EyeOff, Pencil, Trash2 } from "lucide-react";

interface MessageActionsProps {
    onEdit?: () => void;
    onDeleteForEveryone?: () => void;
    onDeleteForMe?: () => void;
}

export default function MessageActions({
    onEdit,
    onDeleteForEveryone,
    onDeleteForMe,
}: MessageActionsProps) {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#151926] p-1 shadow-lg">
            {onEdit && (
                <button title="Edit" onClick={onEdit} className="rounded p-2 transition hover:bg-white/5">
                    <Pencil size={15} />
                </button>
            )}

            {onDeleteForMe && (
                <button title="Delete for me" onClick={onDeleteForMe} className="rounded p-2 text-yellow-300 transition hover:bg-yellow-500/10">
                    <EyeOff size={15} />
                </button>
            )}

            {onDeleteForEveryone && (
                <button title="Delete for everyone" onClick={onDeleteForEveryone} className="rounded p-2 text-red-400 transition hover:bg-red-500/10">
                    <Trash2 size={15} />
                </button>
            )}
        </div>
    );
}