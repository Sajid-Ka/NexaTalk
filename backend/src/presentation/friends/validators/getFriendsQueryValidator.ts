import { z } from "zod";
import { FriendsStatus } from "../../../shared/constants/friends-status.const";

export const getFriendsQuerySchema = z.object({
  status: z.enum([FriendsStatus.ACCEPTED, FriendsStatus.PENDING, FriendsStatus.BLOCKED]).optional(),
  search: z.string().optional(),
});

export type GetFriendsQuery = z.infer<typeof getFriendsQuerySchema>;
