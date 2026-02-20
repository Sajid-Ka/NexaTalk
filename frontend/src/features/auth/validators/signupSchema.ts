import { z } from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be max 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore allowed"),

    email: z.string().trim().email("Invalid email format").toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Must use lower case")
        .regex(/[A-Z]/, "Must use at least one Uppercase letter")
        .regex(/[0-9]/, "Must use at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must use at least one special character"),

    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;