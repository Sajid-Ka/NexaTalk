import { z } from "zod";
import { emailValidator } from "../../../shared/baseValidators/authValidator";

export const requestVerificationEmailSchema = z.object({
  email: emailValidator,
});

export type RequestVerificationEmailRequest = z.infer<typeof requestVerificationEmailSchema>;
