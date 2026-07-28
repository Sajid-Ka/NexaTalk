import { z } from "zod";

export const renameGroupSchema = z.object({
  name: z.string().trim().min(3).max(50),
});
