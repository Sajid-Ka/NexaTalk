import { z } from "zod";

export const removeInterestsSchema = z.object({
  interestIds: z
    .array(z.string())
    .min(1, "At least one interest ID is required")
    .max(20, "Cannot remove more than 20 interests at once"),
});

export type RemoveInterestsRequest = z.infer<typeof removeInterestsSchema>;
