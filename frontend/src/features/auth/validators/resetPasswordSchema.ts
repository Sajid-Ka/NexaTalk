import { z } from "zod";
import { confirmPasswordValidator, passwordValidator } from "../../../shared/baseValidators/authBaseValidator";

export const resetPasswordSchema = z.object({
    newPassword: passwordValidator,
    confirmPassword: confirmPasswordValidator,
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
