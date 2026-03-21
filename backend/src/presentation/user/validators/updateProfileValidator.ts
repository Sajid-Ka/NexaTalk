import { z } from "zod";

export const updateProfileSchema = z.object({
  avatar: z.string().url("Invalid avatar URL").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  isProfilePublic: z.boolean().optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
