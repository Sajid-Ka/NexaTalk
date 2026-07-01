import { Pencil, Trash2 } from "lucide-react";

interface MessageActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export default function MessageActions({
    onEdit,
    onDelete,
}: MessageActionsProps) {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#151926] p-1 shadow-lg">
            <button
                onClick={onEdit}
                className="rounded p-2 transition hover:bg-white/5"
            >
                <Pencil size={15} />
            </button>

            <button
                onClick={onDelete}
                className="rounded p-2 text-red-400 transition hover:bg-red-500/10"
            >
                <Trash2 size={15} />
            </button>
        </div>
    );
}