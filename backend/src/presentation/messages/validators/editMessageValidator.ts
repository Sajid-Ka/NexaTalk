import { z } from "zod";

export const editMessageSchema = z.object({
  messageId: z.string().min(1),

  content: z.string().trim().min(1).max(4000),
});
