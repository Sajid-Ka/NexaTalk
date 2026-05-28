import { z } from "zod";

export const listServersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
  search: z.string().optional(),
  status: z.enum(["all", "active", "disabled"]).optional(),
  sort: z.string().optional(),
});
