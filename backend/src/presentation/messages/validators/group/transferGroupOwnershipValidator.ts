import { z } from "zod";

export const transferGroupOwnershipSchema = z.object({
  newOwnerId: z.string().min(1),
});
