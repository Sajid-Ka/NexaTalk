import { z } from "zod";
import { emailValidator } from "../../../shared/baseValidators/authValidator";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: z.string().min(1, "Confirm password is required"),
});

export const changeEmailSchema = z.object({
  newEmail: emailValidator,
  passwordConfirmation: z.string().min(1, "Password is required to confirm"),
});
