import { z } from "zod";

export const getConversationMessagesSchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional(),
  cursor: z.string().optional(),
});
