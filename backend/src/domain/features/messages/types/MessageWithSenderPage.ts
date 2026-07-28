import { MessageWithSender } from "./MessageWithSender";

export interface MessageWithSenderPage {
  messages: MessageWithSender[];
  nextCursor: string | null;
  hasMore: boolean;
}
