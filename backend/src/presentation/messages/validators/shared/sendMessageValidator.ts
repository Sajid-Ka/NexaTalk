import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1),

  content: z.string().trim().min(1, "Message cannot be empty").max(4000, "Message is too long"),
});
