import { z } from "zod";

export const createInviteSchema = z.object({
  maxUses: z.coerce.number().int().min(0).max(100).optional(),
  expiresInDays: z.coerce.number().int().min(1).max(30).optional(),
});

export type CreateInviteRequest = z.infer<typeof createInviteSchema>;
