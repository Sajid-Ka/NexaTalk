import { useState } from "react";
import Modal from "../../../../shared/ui/Modal";
import Button from "../../../../shared/ui/Button";
import GroupMemberSelector from "./GroupMemberSelector";
import type { GroupConversation } from "../types/group.types";
import { useAddGroupMembers } from "../hooks/useAddGroupMembers";

interface AddGroupMembersModalProps {
    isOpen: boolean;
    group: GroupConversation;
    onClose: () => void;
}

export default function AddGroupMembersModal({
    isOpen,
    group,
    onClose,
}: AddGroupMembersModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const addGroupMembers = useAddGroupMembers();

    const handleClose = () => {
        setSelectedIds([]);
        onClose();
    };

    const handleAddMembers = () => {
        addGroupMembers.mutate(
            {
                conversationId: group.conversationId,
                participantIds: selectedIds,
            },
            {
                onSuccess: handleClose,
            }
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Members"
            className="max-w-2xl"
        >
            <div className="space-y-6">
                <GroupMemberSelector
                    selectedIds={selectedIds}
                    onChange={setSelectedIds}
                    excludeIds={group.participantIds}
                />

                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleAddMembers}
                        disabled={selectedIds.length === 0}
                        isLoading={addGroupMembers.isPending}
                    >
                        Add Members
                    </Button>
                </div>
            </div>
        </Modal>
    );
}