// src/shared/ui/ConfirmModal.tsx
import { X } from "lucide-react";
import { cn } from "../utils/cn";
import Button from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: "bg-red-500/10 text-red-500",
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
      border: "border-red-500/20"
    },
    warning: {
      icon: "bg-yellow-500/10 text-yellow-500",
      button: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600",
      border: "border-yellow-500/20"
    },
    info: {
      icon: "bg-blue-500/10 text-blue-500",
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600",
      border: "border-blue-500/20"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={cn(
          "w-full max-w-md rounded-2xl bg-[#0F121D] border shadow-2xl animate-in fade-in zoom-in duration-200",
          variants[variant].border
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 border-white/10"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "text-white border-none",
              variants[variant].button
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}