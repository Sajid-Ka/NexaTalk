import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMessageForMeApi } from "../api/messageApi";
import { ConversationQuery } from "../../../../shared/constants/message.const";
import type { MessagePage } from "../types/message.types";

export function useDeleteMessageForMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId }: { conversationId: string; messageId: string }) =>
      deleteMessageForMeApi({ messageId }),

    onSuccess: async (_result, variables) => {
      queryClient.setQueryData(
        [ConversationQuery.CONVERSATION, variables.conversationId],
        (oldData: MessagePage | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            messages: oldData.messages.filter((message) => message.id !== variables.messageId),
          };
        },
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [ConversationQuery.CONVERSATION, variables.conversationId],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [ConversationQuery.DIRECT_CONVERSATIONS],
          refetchType: "active",
        }),
        queryClient.invalidateQueries({
          queryKey: [ConversationQuery.GROUP_CONVERSATIONS],
          refetchType: "active",
        }),
      ]);
    },
  });
}
