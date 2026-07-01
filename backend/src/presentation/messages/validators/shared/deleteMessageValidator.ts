import { z } from "zod";

export const deleteMessageSchema = z.object({
  messageId: z.string().min(1),
});
