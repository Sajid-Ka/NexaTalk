import { z } from "zod";

export const searchInterestsQuerySchema = z.object({
  q: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(50, "Search query too long")
    .optional(),
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .optional()
    .default(10),
});

export type SearchInterestsQuery = z.infer<typeof searchInterestsQuerySchema>;
