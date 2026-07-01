import { MarkAsReadResponse } from "../dtos/responses/MarkAsReadResponse";

export class MarkAsReadResponseMapper {
  static toResponse(conversationId: string, messageId: string): MarkAsReadResponse {
    return {
      conversationId,
      messageId,
    };
  }
}
