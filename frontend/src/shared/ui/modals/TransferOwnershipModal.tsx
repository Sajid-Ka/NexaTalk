import { useState } from "react";
import Modal from "../Modal";
import Button from "../Button";

interface Props {
  isOpen: boolean;
  username: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function TransferOwnershipModal({ isOpen, username, loading, onConfirm, onClose }: Props) {
  const [inputValue, setInputValue] = useState("");
  const expectedText = "transfer ownership";

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const handleConfirm = () => {
    if (inputValue.toLowerCase().trim() === expectedText) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Transfer Server Ownership" className="max-w-md">
      <div>
        <p className="text-sm leading-6 text-slate-400">
          Are you sure you want to transfer ownership of this server to <span className="font-semibold text-white">{username}</span>? This action cannot be undone, and you will be demoted to an admin.
        </p>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Please type <span className="font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">transfer ownership</span> to confirm.
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0F121D] px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="transfer ownership"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button
            variant="destructive"
            isLoading={loading}
            disabled={inputValue.toLowerCase().trim() !== expectedText}
            onClick={handleConfirm}
          >
            Transfer Ownership
          </Button>
        </div>
      </div>
    </Modal>
  );
}
