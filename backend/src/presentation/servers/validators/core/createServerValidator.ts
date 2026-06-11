import { z } from "zod";
import {
  ServerPrivacy,
  ServerValidation,
  ServerTag,
} from "../../../../shared/constants/server.const";

export const createServerSchema = z.object({
  name: z
    .string()
    .min(
      ServerValidation.MIN_NAME_LENGTH,
      `Name must be at least ${ServerValidation.MIN_NAME_LENGTH} characters`,
    )
    .max(
      ServerValidation.MAX_NAME_LENGTH,
      `Name must be at most ${ServerValidation.MAX_NAME_LENGTH} characters`,
    ),
  description: z
    .string()
    .max(
      ServerValidation.MAX_DESCRIPTION_LENGTH,
      `Description must be at most ${ServerValidation.MAX_DESCRIPTION_LENGTH} characters`,
    )
    .optional(),
  icon: z.string().url().optional(),
  banner: z.string().url().optional(),
  privacy: z.enum([ServerPrivacy.PUBLIC, ServerPrivacy.PRIVATE]),
  tag: z.nativeEnum(ServerTag, {
    error: "Please select a valid server tag",
  }),
});

export type CreateServerRequest = z.infer<typeof createServerSchema>;
