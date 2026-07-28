import { GroupRole } from "../../../../shared/constants/group-role.const";

export interface GroupParticipantRole {
    userId: string;
    role: GroupRole;
}

export interface GroupMember {
    id: string;
    username: string;
    avatar?: string;
    status?: string;
    role: GroupRole;
}

export interface GroupConversation {
    conversationId: string;
    ownerId: string;
    name: string;
    avatar?: string;
    participantIds: string[];
    currentUserRole: GroupRole;
    participantRoles: GroupParticipantRole[];
    members?: GroupMember[];
    lastMessage?: string;
    updatedAt: Date;
}