import { z } from "zod";
import { GroupRole } from "../../../../shared/constants/group-role.const";

export const updateGroupMemberRoleSchema = z.object({
  role: z.enum([GroupRole.ADMIN, GroupRole.MEMBER]),
});
