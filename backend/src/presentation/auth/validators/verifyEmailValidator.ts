import { z } from "zod"

export const verifyEmailSchema = z.object({
    token : z.string().min(10, "Invalid token"),
})

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>;