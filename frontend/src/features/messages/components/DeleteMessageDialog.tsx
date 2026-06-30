import Button from "../../../shared/ui/Button";

interface DeleteMessageDialogProps {
    open: boolean;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function DeleteMessageDialog({
    open,
    loading,
    onCancel,
    onConfirm,
}: DeleteMessageDialogProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151926] p-6 shadow-2xl">
                <h2 className="text-lg font-bold">
                    Delete Message?
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/50">
                    This message will be removed for everyone.
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={loading}
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-500"
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}