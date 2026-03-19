import { z } from "zod";

export const addInterestsSchema = z.object({
  interests: z
    .array(
      z
        .string()
        .min(2, "Interest must be at least 2 characters")
        .max(50, "Interest must be at most 50 characters")
        .trim(),
    )
    .min(1, "At least one interest is required")
    .max(20, "Cannot add more than 20 interests at once"),
});

export type AddInterestsRequest = z.infer<typeof addInterestsSchema>;
