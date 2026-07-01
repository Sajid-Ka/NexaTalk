import { DirectConversationResponse } from "../dtos/responses/DirectConversationResponse";

export interface IGetDirectConversationsUsecase {
  execute(userId: string): Promise<DirectConversationResponse[]>;
}
