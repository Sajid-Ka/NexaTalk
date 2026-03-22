import { z } from "zod";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";

export const respondFriendRequestSchema = z.object({
  status: z.enum([FriendsStatus.ACCEPTED, FriendsStatus.BLOCKED]),
});

export type RespondFriendRequestRequest = z.infer<typeof respondFriendRequestSchema>;
