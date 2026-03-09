import { z } from "zod";
import { emailValidator } from "../../../shared/baseValidators/authValidator";

export const loginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>
