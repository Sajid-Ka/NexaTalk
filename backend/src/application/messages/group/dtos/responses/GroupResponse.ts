import { GroupRole } from "../../../../../shared/constants/group-role.const";
import { UserPresenceStatus } from "../../../../../shared/constants/user.const";

export interface GroupParticipantRoleResponse {
  userId: string;
  role: GroupRole;
}

export interface GroupMemberResponse {
  id: string;
  username: string;
  avatar?: string;
  status?: UserPresenceStatus;
  role: GroupRole;
}

export interface GroupResponse {
  conversationId: string;
  name: string;
  avatar?: string;
  ownerId: string;
  participantIds: string[];
  currentUserRole: GroupRole;
  participantRoles: GroupParticipantRoleResponse[];
  members: GroupMemberResponse[];
  createdAt: Date;
}
