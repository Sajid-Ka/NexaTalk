import { SendMessageRequest } from "../dtos/requests/SendMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";

export interface ISendMessageUsecase {
  execute(userId: string, request: SendMessageRequest): Promise<MessageResponse>;
}
