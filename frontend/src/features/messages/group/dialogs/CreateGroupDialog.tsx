import { useState } from "react";
import Modal from "../../../../shared/ui/Modal";
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import GroupMemberSelector from "../components/GroupMemberSelector";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useAppDispatch } from "../../../../app/store";
import { closeDirectChat } from "../../direct/store/directChatSlice";
import { openGroupChat } from "../store/groupChatSlice";

interface CreateGroupDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateGroupDialog({
    isOpen,
    onClose,
}: CreateGroupDialogProps) {
    const [groupName, setGroupName] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const { mutate: createGroup, isPending } = useCreateGroup();
    const dispatch = useAppDispatch();

    const handleCreateGroup = () => {
        createGroup(
            {
                name: groupName.trim(),
                participantIds: selectedIds,
            },
            {
                onSuccess: (response) => {
                    const group = response.data.data;

                    dispatch(closeDirectChat());

                    dispatch(
                        openGroupChat(
                            group.conversationId
                        )
                    );

                    handleClose();
                },
            }
        );
    };

    const handleClose = () => {
        setGroupName("");
        setSelectedIds([]);

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Group"
            className="max-w-2xl"
        >
            <div className="space-y-6">

                <Input
                    label="Group Name"
                    placeholder="Weekend Gamers"
                    value={groupName}
                    onChange={(e) =>
                        setGroupName(e.target.value)
                    }
                />

                <GroupMemberSelector
                    selectedIds={selectedIds}
                    onChange={setSelectedIds}
                />

                <div className="flex justify-end gap-3">

                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCreateGroup}
                        isLoading={isPending}
                        disabled={
                            !groupName.trim() ||
                            selectedIds.length === 0
                        }
                    >
                        Create Group
                    </Button>

                </div>

            </div>
        </Modal>
    );
}