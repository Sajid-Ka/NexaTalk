import { z } from "zod";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

export const updateMemberRoleSchema = z.object({
  role: z.enum([
    ServerMemberRole.ADMIN,
    ServerMemberRole.MEMBER,
  ]),
});