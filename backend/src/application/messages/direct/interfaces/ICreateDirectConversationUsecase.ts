import { CreateDirectConversationRequest } from "../dtos/requests/CreateDirectConversationRequest";
import { ConversationResponse } from "../../shared/dtos/responses/ConversationResponse";

export interface ICreateDirectConversationUsecase {
  execute(userId: string, request: CreateDirectConversationRequest): Promise<ConversationResponse>;
}
