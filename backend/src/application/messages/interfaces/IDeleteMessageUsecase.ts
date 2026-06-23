import { DeleteMessageRequest } from "../dtos/requests/DeleteMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";

export interface IDeleteMessageUsecase {
  execute(userId: string, request: DeleteMessageRequest): Promise<MessageResponse>;
}
