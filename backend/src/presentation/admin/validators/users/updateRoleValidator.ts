import { z } from "zod";
import { GlobalRole } from "../../../../shared/constants/user.const";

export const updateRoleSchema = z.object({
  role: z.enum([GlobalRole.USER, GlobalRole.ADMIN]),
});
