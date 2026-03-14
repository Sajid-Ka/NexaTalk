import { z } from "zod";

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  search: z.string().optional(),
  status: z.enum(["active", "blocked"]).optional(),
  sort: z.string().optional(),
});
