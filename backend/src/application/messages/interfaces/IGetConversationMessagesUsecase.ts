import { GetConversationMessagesRequest } from "../dtos/requests/GetConversationMessagesRequest";
import { MessagePageResponse } from "../dtos/responses/MessagePageResponse";

export interface IGetConversationMessagesUsecase {
  execute(userId: string, request: GetConversationMessagesRequest): Promise<MessagePageResponse>;
}
