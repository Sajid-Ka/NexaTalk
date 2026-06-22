import { z } from "zod";
import { RecommendationType } from "../../../shared/constants/recommendation.const";

export const getRecommendationsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .optional()
    .default(10),
  type: z
    .enum([RecommendationType.PEOPLE, RecommendationType.SERVERS, RecommendationType.BOTH])
    .optional()
    .default(RecommendationType.BOTH),
  refresh: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional()
    .default(false),
});

export type GetRecommendationsQuery = z.infer<typeof getRecommendationsQuerySchema>;
