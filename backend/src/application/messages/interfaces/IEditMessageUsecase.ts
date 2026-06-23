import { EditMessageRequest } from "../dtos/requests/EditMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";

export interface IEditMessageUsecase {
  execute(userId: string, request: EditMessageRequest): Promise<MessageResponse>;
}
