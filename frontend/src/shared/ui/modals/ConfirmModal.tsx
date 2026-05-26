import Modal from "../Modal";
import Button from "../Button";

interface Props {
  isOpen: boolean;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  destructive?: boolean;
  loading?: boolean;

  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive,
  loading,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="max-w-md"
    >
      <div>
        <p className="text-sm leading-6 text-slate-400">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={
              destructive
                ? "destructive"
                : "primary"
            }
            isLoading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}