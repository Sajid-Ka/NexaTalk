import { useState } from "react";
import Modal from "../../../shared/ui/Modal";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import type { Channel } from "../types";

interface Props {
  isOpen: boolean;
  channel: Channel | null;
  loading: boolean;
  onClose: () => void;
  onRename: (name: string) => void;
}

export default function ChannelRenameModal({
  isOpen,
  channel,
  loading,
  onClose,
  onRename,
}: Props) {
  const [name, setName] = useState(channel?.name ?? "");

  if (!channel) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Channel">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          onRename(name.trim());
        }}
      >
        <Input
          autoFocus
          label="Channel name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={!name.trim()}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}