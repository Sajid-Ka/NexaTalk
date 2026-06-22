import { CreateDirectConversationRequest } from "../dtos/requests/CreateDirectConversationRequest";
import { ConversationResponse } from "../dtos/responses/ConversationResponse";

export interface ICreateDirectConversationUsecase {
  execute(userId: string, request: CreateDirectConversationRequest): Promise<ConversationResponse>;
}
