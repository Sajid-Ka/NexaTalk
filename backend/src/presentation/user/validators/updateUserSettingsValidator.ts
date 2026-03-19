import { z } from "zod";

export const updateUserSettingsSchema = z.object({
  showRecommendations: z.boolean().optional(),
  allowFriendRecommendations: z.boolean().optional(),
  allowServerRecommendations: z.boolean().optional(),
});

export type UpdateUserSettingsRequest = z.infer<typeof updateUserSettingsSchema>;
