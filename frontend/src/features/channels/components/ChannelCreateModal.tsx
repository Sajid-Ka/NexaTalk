import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Hash, Volume2 } from "lucide-react";
import Modal from "../../../shared/ui/Modal";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import { cn } from "../../../shared/utils/cn";
import {
  ChannelType,
  type ChannelType as ChannelTypeValue,
} from "../../../shared/constants/channel.const";

interface ChannelCreateModalProps {
  isOpen: boolean;
  loading: boolean;
  initialType: ChannelTypeValue;
  onClose: () => void;
  onCreate: (data: { name: string; type: ChannelTypeValue }) => void;
}

export default function ChannelCreateModal({
  isOpen,
  loading,
  initialType,
  onClose,
  onCreate,
}: ChannelCreateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ChannelTypeValue>(initialType);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), type });
  };

  const handleClose = () => {
    setName("");
    setType(initialType);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Channel">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <ChannelTypeButton
            active={type === ChannelType.TEXT}
            icon={<Hash size={16} />}
            label="Text"
            onClick={() => setType(ChannelType.TEXT)}
          />
          <ChannelTypeButton
            active={type === ChannelType.VOICE}
            icon={<Volume2 size={16} />}
            label="Voice"
            onClick={() => setType(ChannelType.VOICE)}
          />
        </div>

        <Input
          autoFocus
          label="Channel name"
          placeholder={type === ChannelType.TEXT ? "general" : "lobby"}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={!name.trim()}>
            Create Channel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface ChannelTypeButtonProps {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function ChannelTypeButton({ active, icon, label, onClick }: ChannelTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition",
        active
          ? "border-indigo-400 bg-indigo-500/15 text-white"
          : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
