import { z } from "zod";

export const markAsReadSchema = z.object({
  conversationId: z.string().min(1),
  messageId: z.string().min(1),
});
