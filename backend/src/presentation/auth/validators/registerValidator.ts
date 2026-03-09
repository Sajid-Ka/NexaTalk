import { z } from "zod";
import { usernameValidator, emailValidator, passwordValidator, confirmPasswordValidator } from "../../../shared/baseValidators/authValidator";

export const registerSchema = z.object({
  username: usernameValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: confirmPasswordValidator,
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match please check",
    path: ["confirmPassword"]
  })

export type RegisterRequest = z.infer<typeof registerSchema>;