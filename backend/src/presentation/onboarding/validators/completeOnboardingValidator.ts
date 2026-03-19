import { z } from "zod";

export const completeOnboardingSchema = z.object({
  interests: z
    .array(
      z
        .string()
        .min(2, "Interest must be at least 2 characters")
        .max(50, "Interest must be at most 50 characters")
        .trim(),
    )
    .max(20, "Cannot add more than 20 interests at once")
    .optional(),
});

export type CompleteOnboardingRequest = z.infer<typeof completeOnboardingSchema>;
