import { z } from "zod";
import { emailValidator, passwordValidator, confirmPasswordValidator } from "../../../../../shared/baseValidators/authBaseValidator";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordValidator,
  confirmNewPassword: confirmPasswordValidator,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: emailValidator,
  passwordConfirmation: z.string().min(1, "Password is required to confirm"),
});

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;
