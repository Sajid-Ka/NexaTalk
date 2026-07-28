import { ConversationResponse } from "../../shared/dtos/responses/ConversationResponse";
import { GetChannelConversationRequest } from "../dtos/requests/GetChannelConversationRequest";

export interface IGetChannelConversationUsecase {
  execute(userId: string, request: GetChannelConversationRequest): Promise<ConversationResponse>;
}
