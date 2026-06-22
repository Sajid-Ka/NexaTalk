import { z } from "zod";

export const createDirectConversationSchema = z.object({
  targetUserId: z.string().trim().min(1, "Target user id is required"),
});

export type CreateDirectConversationRequest = z.infer<typeof createDirectConversationSchema>;
