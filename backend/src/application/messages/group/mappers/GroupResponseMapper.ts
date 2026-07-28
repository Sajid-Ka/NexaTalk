import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { User } from "../../../../domain/features/auth/entities/User";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { GroupResponse } from "../dtos/responses/GroupResponse";

interface GroupResponseMapperOptions {
  currentUserId: string;
  participants: ConversationParticipant[];
  users?: User[];
}

export class GroupResponseMapper {
  static toResponse(
    conversation: Conversation,
    options: GroupResponseMapperOptions,
  ): GroupResponse {
    const participantRoles = options.participants.map((participant) => ({
      userId: participant.userId,
      role: participant.userId === conversation.ownerId ? GroupRole.OWNER : participant.role,
    }));

    const currentUserRole =
      participantRoles.find((participant) => participant.userId === options.currentUserId)?.role ??
      GroupRole.MEMBER;

    const members = options.participants.map((participant) => {
      const user = options.users?.find((item) => item.id === participant.userId);
      const role = participant.userId === conversation.ownerId ? GroupRole.OWNER : participant.role;

      return {
        id: participant.userId,
        username: user?.username ?? `User ${participant.userId.slice(0, 6)}`,
        avatar: user?.avatar,
        status: user?.status,
        role,
      };
    });

    return {
      conversationId: conversation.id,
      name: conversation.name ?? "",
      avatar: conversation.avatar,
      ownerId: conversation.ownerId!,
      participantIds: conversation.participantIds,
      currentUserRole,
      participantRoles,
      members,
      createdAt: conversation.createdAt,
    };
  }
}
