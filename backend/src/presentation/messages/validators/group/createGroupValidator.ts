import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string().trim().min(3).max(50),
  avatar: z.string().url().optional(),
  participantIds: z.array(z.string()).min(1).max(99),
});
