import { useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import {
    ArrowLeft,
    Crown,
    LogOut,
    MoreHorizontal,
    Shield,
    Smile,
    Trash2,
    UserPlus,
    UserRoundCog,
    Upload,
    Pencil
} from "lucide-react";
import Modal from "../../../../shared/ui/Modal";
import Avatar from "../../../../shared/ui/Avatar";
import Button from "../../../../shared/ui/Button";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import type { GroupConversation, GroupMember } from "../types/group.types";
import { useUpdateGroupMemberRole } from "../hooks/useUpdateGroupMemberRole";
import { useRemoveGroupMember } from "../hooks/useRemoveGroupMember";
import { useLeaveGroup } from "../hooks/useLeaveGroup";
import { useTransferGroupOwnership } from "../hooks/useTransferGroupOwnership";
import { useDeleteGroup } from "../hooks/useDeleteGroup";
import ConfirmModal from "../../../../shared/ui/modals/ConfirmModal";
import AddGroupMembersModal from "./AddGroupMembersModal";
import { useUploadGroupAvatar } from "../hooks/useUploadGroupAvatar";
import Input from "../../../../shared/ui/Input";
import { useRenameGroup } from "../hooks/useRenameGroup";

type GroupInfoView = "info" | "transfer" | "rename";

interface GroupInfoModalProps {
    isOpen: boolean;
    group: GroupConversation;
    onClose: () => void;
}

export default function GroupInfoModal({
    isOpen,
    group,
    onClose,
}: GroupInfoModalProps) {
    const [view, setView] = useState<GroupInfoView>("info");
    const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
    const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
    const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
    const [deleteGroupConfirmOpen, setDeleteGroupConfirmOpen] = useState(false);
    const [addMembersOpen, setAddMembersOpen] = useState(false);
    const [memberToDemote, setMemberToDemote] = useState<GroupMember | null>(null);
    const [leaveGroupConfirmOpen, setLeaveGroupConfirmOpen] = useState(false);
    const [transferConfirmOpen, setTransferConfirmOpen] = useState(false);

    const [nextGroupName, setNextGroupName] = useState(group.name);
    const renameGroup = useRenameGroup();

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const uploadGroupAvatar = useUploadGroupAvatar();

    const canEditGroup =
        group.currentUserRole === GroupRole.OWNER ||
        group.currentUserRole === GroupRole.ADMIN;

    const updateRole = useUpdateGroupMemberRole();
    const removeMember = useRemoveGroupMember();
    const leaveGroup = useLeaveGroup();
    const transferOwnership = useTransferGroupOwnership();

    const isOwner = group.currentUserRole === GroupRole.OWNER;
    const members = useMemo(() => getGroupMembers(group), [group]);

    const deleteGroup = useDeleteGroup();

    const transferCandidates = members.filter(
        (member) => member.role !== GroupRole.OWNER
    );

    const selectedOwner = transferCandidates.find(
        (member) => member.id === selectedOwnerId
    );

    const handleClose = () => {
        setView("info");
        setOpenMenuUserId(null);
        setSelectedOwnerId("");
        setMemberToDemote(null);
        setLeaveGroupConfirmOpen(false);
        setTransferConfirmOpen(false);
        onClose();
        setAddMembersOpen(false);
        setNextGroupName(group.name);
    };

    const handlePromote = (member: GroupMember) => {
        updateRole.mutate({
            conversationId: group.conversationId,
            userId: member.id,
            role: GroupRole.ADMIN,
        });

        setOpenMenuUserId(null);
    };

    const handleDemote = (member: GroupMember) => {
        setMemberToDemote(member);
        setOpenMenuUserId(null);
    };

    const confirmDemoteMember = () => {
        if (!memberToDemote) return;

        updateRole.mutate(
            {
                conversationId: group.conversationId,
                userId: memberToDemote.id,
                role: GroupRole.MEMBER,
            },
            {
                onSuccess: () => setMemberToDemote(null),
            }
        );
    };

    const handleRemove = (member: GroupMember) => {
        setMemberToRemove(member);
        setOpenMenuUserId(null);
    };

    const confirmRemoveMember = () => {
        if (!memberToRemove) return;

        removeMember.mutate(
            {
                conversationId: group.conversationId,
                userId: memberToRemove.id,
            },
            {
                onSuccess: () => setMemberToRemove(null),
            }
        );
    };

    const handleLeaveGroup = () => {
        setLeaveGroupConfirmOpen(true);
    };
    
    const confirmLeaveGroup = () => {
        leaveGroup.mutate(group.conversationId, {
            onSuccess: () => {
                setLeaveGroupConfirmOpen(false);
                handleClose();
            },
        });
    };

    const handleTransferOwnership = () => {
        if (!selectedOwnerId) return;

        setTransferConfirmOpen(true);
    };

    const confirmTransferOwnership = () => {
        if (!selectedOwnerId) return;

        transferOwnership.mutate(
            {
                conversationId: group.conversationId,
                newOwnerId: selectedOwnerId,
            },
            {
                onSuccess: () => {
                    setTransferConfirmOpen(false);
                    setView("info");
                    setSelectedOwnerId("");
                },
            }
        );
    };

    const handleDeleteGroup = () => {
        setDeleteGroupConfirmOpen(true);
    };

    const confirmDeleteGroup = () => {
        deleteGroup.mutate(group.conversationId, {
            onSuccess: () => {
                setDeleteGroupConfirmOpen(false);
                handleClose();
            },
        });
    };

    const handleRenameGroup = () => {
        const trimmedName = nextGroupName.trim();

        if (!trimmedName || trimmedName === group.name) return;

        renameGroup.mutate(
            {
                conversationId: group.conversationId,
                name: trimmedName,
            },
            {
                onSuccess: () => setView("info"),
            }
        );
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        uploadGroupAvatar.mutate({
            conversationId: group.conversationId,
            file,
        });

        event.target.value = "";
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={
                    view === "rename"
                        ? "Rename Group"
                        : view === "transfer"
                        ? "Transfer Ownership"
                        : "Group Info"
                }
                className="max-w-md"
            >
                {view === "rename" ? (
                    <div className="space-y-5">
                        <button
                            type="button"
                            onClick={() => setView("info")}
                            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <Input
                            label="Group Name"
                            value={nextGroupName}
                            onChange={(event) => setNextGroupName(event.target.value)}
                            placeholder="Enter group name"
                        />

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setView("info")}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleRenameGroup}
                                isLoading={renameGroup.isPending}
                                disabled={
                                    nextGroupName.trim().length < 3 ||
                                    nextGroupName.trim() === group.name
                                }
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : view === "transfer" ? (
                    <div className="space-y-5">
                        <button
                            type="button"
                            onClick={() => setView("info")}
                            className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                            After transfer, you become an admin and the selected person becomes the owner.
                        </div>

                        <div className="space-y-2">
                            {transferCandidates.map((member) => (
                                <button
                                    key={member.id}
                                    type="button"
                                    onClick={() => setSelectedOwnerId(member.id)}
                                    className={
                                        selectedOwnerId === member.id
                                            ? "flex w-full items-center gap-3 rounded-xl border border-indigo-500/50 bg-indigo-500/10 px-3 py-3 text-left"
                                            : "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-white/5 hover:bg-white/5"
                                    }
                                >
                                    <Avatar
                                        src={member.avatar}
                                        fallback={member.username}
                                        size="md"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white">
                                            {member.username}
                                        </p>

                                        <p className="text-xs capitalize text-white/40">
                                            {member.role}
                                        </p>
                                    </div>

                                    {member.role === GroupRole.ADMIN && (
                                        <RoleBadge
                                            icon={<Shield size={13} />}
                                            label="Admin"
                                            className="bg-indigo-500/10 text-indigo-300"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {transferCandidates.length === 0 && (
                            <p className="rounded-xl bg-white/5 px-4 py-6 text-center text-sm text-white/40">
                                Add another member before transferring ownership.
                            </p>
                        )}

                        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <Button
                                variant="secondary"
                                onClick={() => setView("info")}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleTransferOwnership}
                                disabled={!selectedOwnerId}
                                isLoading={transferOwnership.isPending}
                            >
                                Transfer
                                {selectedOwner ? ` to ${selectedOwner.username}` : ""}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center border-b border-white/5 pb-6 text-center">
                            <div className="relative">
                                <Avatar
                                    src={group.avatar}
                                    fallback={group.name}
                                    size="xl"
                                />

                                {canEditGroup && (
                                    <>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => avatarInputRef.current?.click()}
                                            disabled={uploadGroupAvatar.isPending}
                                            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#151926] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Upload size={16} />
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2">
                                <h2 className="text-xl font-bold text-white">
                                    {group.name}
                                </h2>

                                {canEditGroup && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNextGroupName(group.name);
                                            setView("rename");
                                        }}
                                        className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                )}
                            </div>

                            <p className="mt-1 text-sm text-white/40">
                                {group.participantIds.length} members
                            </p>
                        </div>

                        <section>
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                                Members
                            </h3>

                            <div className="space-y-2">
                                {members.map((member) => {
                                    const canManageMember =
                                        isOwner && member.role !== GroupRole.OWNER;

                                    return (
                                        <div
                                            key={member.id}
                                            className="relative flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/5"
                                        >
                                            <Avatar
                                                src={member.avatar}
                                                fallback={member.username}
                                                size="md"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {member.username}
                                                </p>
                                            </div>

                                            {member.role === GroupRole.OWNER && (
                                                <RoleBadge
                                                    icon={<Crown size={13} />}
                                                    label="Owner"
                                                    className="bg-yellow-500/10 text-yellow-300"
                                                />
                                            )}

                                            {member.role === GroupRole.ADMIN && (
                                                <RoleBadge
                                                    icon={<Shield size={13} />}
                                                    label="Admin"
                                                    className="bg-indigo-500/10 text-indigo-300"
                                                />
                                            )}

                                            {member.role === GroupRole.MEMBER && (
                                                <Smile
                                                    size={16}
                                                    className="text-white/30"
                                                />
                                            )}

                                            {canManageMember && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenMenuUserId(
                                                            openMenuUserId === member.id
                                                                ? null
                                                                : member.id
                                                        )
                                                    }
                                                    className="rounded-lg p-2 text-white/50 transition hover:bg-white/5 hover:text-white"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            )}

                                            {openMenuUserId === member.id && (
                                                <div className="absolute right-2 top-12 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#151926] shadow-xl">
                                                    {member.role === GroupRole.MEMBER && (
                                                        <MemberMenuButton
                                                            onClick={() =>
                                                                handlePromote(member)
                                                            }
                                                        >
                                                            Promote to Admin
                                                        </MemberMenuButton>
                                                    )}

                                                    {member.role === GroupRole.ADMIN && (
                                                        <MemberMenuButton
                                                            onClick={() =>
                                                                handleDemote(member)
                                                            }
                                                        >
                                                            Demote to Member
                                                        </MemberMenuButton>
                                                    )}

                                                    <MemberMenuButton
                                                        danger
                                                        onClick={() =>
                                                            handleRemove(member)
                                                        }
                                                    >
                                                        Remove
                                                    </MemberMenuButton>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="space-y-2 border-t border-white/5 pt-4">
                            {(group.currentUserRole === GroupRole.OWNER ||
                                group.currentUserRole === GroupRole.ADMIN) && (
                                    <ActionButton
                                        icon={<UserPlus size={18} />}
                                        onClick={() => setAddMembersOpen(true)}
                                    >
                                        Add Members
                                    </ActionButton>
                            )}

                            {!isOwner && (
                                <ActionButton
                                    icon={<LogOut size={18} />}
                                    onClick={handleLeaveGroup}
                                    loading={leaveGroup.isPending}
                                >
                                    Leave Group
                                </ActionButton>
                            )}

                            {isOwner && (
                                <>
                                    <ActionButton
                                        icon={<UserRoundCog size={18} />}
                                        onClick={() => setView("transfer")}
                                    >
                                        Transfer Ownership
                                    </ActionButton>

                                    <ActionButton
                                        icon={<Trash2 size={18} />}
                                        danger
                                        onClick={handleDeleteGroup}
                                        loading={deleteGroup.isPending}
                                    >
                                        Delete Group
                                    </ActionButton>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmModal
                isOpen={!!memberToRemove}
                title={`Remove ${memberToRemove?.username}?`}
                description={`Are you sure you want to remove ${memberToRemove?.username} from ${group.name}? They will lose access to this group conversation.`}
                confirmText="Remove"
                destructive
                loading={removeMember.isPending}
                onClose={() => setMemberToRemove(null)}
                onConfirm={confirmRemoveMember}
            />

            <ConfirmModal
                isOpen={deleteGroupConfirmOpen}
                title={`Delete ${group.name}?`}
                description="This will delete the group for everyone, remove all members, and delete all messages in this group. This action cannot be undone."
                confirmText="Delete Group"
                destructive
                loading={deleteGroup.isPending}
                onClose={() => setDeleteGroupConfirmOpen(false)}
                onConfirm={confirmDeleteGroup}
            />

            <ConfirmModal
                isOpen={!!memberToDemote}
                title={`Demote ${memberToDemote?.username}?`}
                description={`Are you sure you want to demote ${memberToDemote?.username} from admin to member? They will lose admin permissions in ${group.name}.`}
                confirmText="Demote"
                destructive
                loading={updateRole.isPending}
                onClose={() => setMemberToDemote(null)}
                onConfirm={confirmDemoteMember}
            />

            <ConfirmModal
                isOpen={leaveGroupConfirmOpen}
                title={`Leave ${group.name}?`}
                description="Are you sure you want to leave this group? You will lose access to this conversation unless someone adds you again."
                confirmText="Leave Group"
                destructive
                loading={leaveGroup.isPending}
                onClose={() => setLeaveGroupConfirmOpen(false)}
                onConfirm={confirmLeaveGroup}
            />

            <ConfirmModal
                isOpen={transferConfirmOpen}
                title={`Transfer ownership to ${selectedOwner?.username}?`}
                description={`Are you sure you want to transfer ownership of ${group.name} to ${selectedOwner?.username}? You will become an admin after the transfer.`}
                confirmText="Transfer Ownership"
                destructive
                loading={transferOwnership.isPending}
                onClose={() => setTransferConfirmOpen(false)}
                onConfirm={confirmTransferOwnership}
            />

            <AddGroupMembersModal
                isOpen={addMembersOpen}
                group={group}
                onClose={() => setAddMembersOpen(false)}
            />
        </>
    );
}

function getGroupMembers(group: GroupConversation): GroupMember[] {
    if (group.members?.length) {
        return group.members;
    }

    return group.participantIds.map((userId) => {
        const role =
            group.participantRoles.find((item) => item.userId === userId)
                ?.role ?? GroupRole.MEMBER;

        return {
            id: userId,
            username: `User ${userId.slice(0, 6)}`,
            role,
        };
    });
}

function RoleBadge({
    icon,
    label,
    className,
}: {
    icon: ReactNode;
    label: string;
    className: string;
}) {
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
}

function MemberMenuButton({
    children,
    onClick,
    danger = false,
}: {
    children: ReactNode;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={
                danger
                    ? "block w-full px-3 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                    : "block w-full px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
            }
        >
            {children}
        </button>
    );
}

function ActionButton({
    icon,
    children,
    danger = false,
    loading = false,
    onClick,
}: {
    icon: ReactNode;
    children: ReactNode;
    danger?: boolean;
    loading?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={
                danger
                    ? "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    : "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-white/80 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            }
        >
            {icon}
            <span className="font-medium">
                {loading ? "Please wait..." : children}
            </span>
        </button>
    );
}