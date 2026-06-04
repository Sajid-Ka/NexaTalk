import { z } from "zod";

export const sendDirectInviteSchema = z.object({
  friendId: z.string().min(1, "Friend ID is required"),
});

export const respondDirectInviteSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});
