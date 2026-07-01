import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export class GroupResponseMapper {
  static toResponse(conversation: Conversation): GroupResponse {
    return {
      id: conversation.id,
      name: conversation.name ?? "",
      avatar: conversation.avatar,
      ownerId: conversation.ownerId!,
      participantIds: conversation.participantIds,
      createdAt: conversation.createdAt,
    };
  }
}
