import { z } from "zod";
import { usernameValidator } from "../../../shared/baseValidators/authValidator";

export const updateProfileSchema = z.object({
  username: usernameValidator.optional(),
  avatar: z.string().url("Invalid avatar URL").optional().nullable(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  isProfilePublic: z.boolean().optional(),
  showOnlineStatus: z.boolean().optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
