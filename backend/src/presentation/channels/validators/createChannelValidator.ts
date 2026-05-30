import { z } from "zod";
import { ChannelType } from "../../../shared/constants/channel.const";

export const createChannelSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: z.enum([ChannelType.TEXT, ChannelType.VOICE]),
});
