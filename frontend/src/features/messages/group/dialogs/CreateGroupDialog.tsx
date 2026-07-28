import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Modal from "../../../../shared/ui/Modal";
import Input from "../../../../shared/ui/Input";
import Button from "../../../../shared/ui/Button";
import Avatar from "../../../../shared/ui/Avatar";
import GroupMemberSelector from "../components/GroupMemberSelector";
import { useCreateGroup } from "../hooks/useCreateGroup";
import { useUploadGroupAvatar } from "../hooks/useUploadGroupAvatar";
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
    const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null);
    const [groupAvatarPreview, setGroupAvatarPreview] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    const { mutate: createGroup, isPending: isCreating } = useCreateGroup();
    const uploadGroupAvatar = useUploadGroupAvatar();

    const dispatch = useAppDispatch();

    const isPending = isCreating || uploadGroupAvatar.isPending;

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setGroupAvatarFile(file);
        setGroupAvatarPreview(URL.createObjectURL(file));

        event.target.value = "";
    };

    const finishCreate = (conversationId: string) => {
        dispatch(closeDirectChat());
        dispatch(openGroupChat(conversationId));
        handleClose();
    };

    const handleCreateGroup = () => {
        createGroup(
            {
                name: groupName.trim(),
                participantIds: selectedIds,
            },
            {
                onSuccess: (response) => {
                    const group = response.data.data;

                    if (!groupAvatarFile) {
                        finishCreate(group.conversationId);
                        return;
                    }

                    uploadGroupAvatar.mutate(
                        {
                            conversationId: group.conversationId,
                            file: groupAvatarFile,
                        },
                        {
                            onSettled: () => {
                                finishCreate(group.conversationId);
                            },
                        }
                    );
                },
            }
        );
    };

    const handleClose = () => {
        setGroupName("");
        setSelectedIds([]);
        setGroupAvatarFile(null);

        if (groupAvatarPreview) {
            URL.revokeObjectURL(groupAvatarPreview);
        }

        setGroupAvatarPreview("");
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
                <div className="flex flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isPending}
                        className="group relative"
                    >
                        <Avatar
                            src={groupAvatarPreview}
                            fallback={groupName || "Group"}
                            size="xl"
                        />

                        <span className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#151926] text-white transition group-hover:bg-white/10">
                            <Upload size={16} />
                        </span>
                    </button>

                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <p className="text-xs text-white/40">
                        Optional group avatar
                    </p>
                </div>

                <Input
                    label="Group Name"
                    placeholder="Weekend Gamers"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <GroupMemberSelector
                    selectedIds={selectedIds}
                    onChange={setSelectedIds}
                />

                <div className="flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleCreateGroup}
                        isLoading={isPending}
                        disabled={
                            !groupName.trim() ||
                            selectedIds.length === 0 ||
                            isPending
                        }
                    >
                        Create Group
                    </Button>
                </div>
            </div>
        </Modal>
    );
}