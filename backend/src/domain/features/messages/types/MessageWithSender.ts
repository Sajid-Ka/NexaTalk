import { Message } from "../entities/Message";

export interface MessageSender {
  id: string;
  username: string;
  avatar?: string;
}

export interface MessageWithSender {
  message: Message;
  sender: MessageSender | null;
}
