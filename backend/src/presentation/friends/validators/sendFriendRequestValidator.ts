import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  friendId: z.string().min(1, "Friend ID is required"),
});

export type SendFriendRequestRequest = z.infer<typeof sendFriendRequestSchema>;
