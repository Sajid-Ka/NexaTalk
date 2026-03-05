import { z } from "zod";
import { confirmPasswordValidator, emailValidator, passwordValidator, usernameValidator } from "../../../shared/baseValidators/authBaseValidator";

export const signupSchema = z.object({
    username : usernameValidator,
    email :  emailValidator,
    password : passwordValidator,
    confirmPassword : confirmPasswordValidator
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;