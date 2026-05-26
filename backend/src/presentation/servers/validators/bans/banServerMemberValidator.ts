import { z } from "zod";

export const banServerMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  reason: z.string().max(300).optional(),
});
