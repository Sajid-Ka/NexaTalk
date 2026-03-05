import { z } from "zod";
import { emailValidator } from "../../../shared/baseValidators/authBaseValidator";

export const forgotPasswordSchema = z.object({
    email: emailValidator,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
