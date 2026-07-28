import { z } from "zod";

export const addGroupMembersSchema = z.object({
  participantIds: z.array(z.string().min(1)).min(1).max(99),
});
