import { Message } from "../entities/Message";

export interface MessagePage {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}
