import { z } from "zod";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  search: z.string().optional(),
  status: z.enum([UserAccountStatus.ACTIVE, UserAccountStatus.BLOCKED]).optional(),
  sort: z.string().optional(),
});
