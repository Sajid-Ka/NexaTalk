import { GroupRole } from "../../../../../shared/constants/group-role.const";

export interface UpdateGroupMemberRoleRequest {
  conversationId: string;
  userId: string;
  role: GroupRole.ADMIN | GroupRole.MEMBER;
}
