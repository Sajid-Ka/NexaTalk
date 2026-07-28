import { useQuery } from "@tanstack/react-query";
import { ConversationQuery } from "../../../shared/constants/message.const";
import { getChannelConversationApi } from "../../messages/shared/api/messageApi";

export function useChannelConversation(serverId: string, channelId: string) {
  return useQuery({
    queryKey: [ConversationQuery.CHANNEL_CONVERSATION, serverId, channelId],
    queryFn: async () => {
      const response = await getChannelConversationApi({ serverId, channelId });
      return response.data.data;
    },
    enabled: Boolean(serverId && channelId),
    staleTime: 5 * 60_000,
  });
}
