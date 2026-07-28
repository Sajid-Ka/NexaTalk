import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { CannotRemoveGroupOwnerError } from "../../../../domain/features/messages/errors/CannotRemoveGroupOwnerError";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { RemoveGroupMemberRequest } from "../dtos/requests/RemoveGroupMemberRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IRemoveGroupMemberUsecase } from "../interfaces/IRemoveGroupMemberUsecase";

@injectable()
export class RemoveGroupMember implements IRemoveGroupMemberUsecase {
  constructor(
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(currentUserId: string, request: RemoveGroupMemberRequest): Promise<GroupResponse> {
    const conversation = await this._conversationRepo.findById(request.conversationId);

    if (!conversation || conversation.type !== ConversationType.GROUP) {
      throw new ConversationNotFoundError();
    }

    const currentParticipant = await this._participantRepo.findParticipant(
      conversation.id,
      currentUserId,
    );

    if (!currentParticipant) {
      throw new NotConversationParticipantError();
    }

    const targetParticipant = await this._participantRepo.findParticipant(
      conversation.id,
      request.userId,
    );

    if (!targetParticipant) {
      throw new NotConversationParticipantError();
    }

    if (targetParticipant.role === GroupRole.OWNER || request.userId === conversation.ownerId) {
      throw new CannotRemoveGroupOwnerError();
    }

    if (currentParticipant.role === GroupRole.MEMBER) {
      throw new ForbiddenError("Members cannot remove group members");
    }

    if (
      currentParticipant.role === GroupRole.ADMIN &&
      targetParticipant.role !== GroupRole.MEMBER
    ) {
      throw new ForbiddenError("Admins can only remove normal members");
    }

    await this._participantRepo.removeParticipant(conversation.id, request.userId);

    const participantIds = conversation.participantIds.filter(
      (participantId) => participantId !== request.userId,
    );

    const updatedConversation = await this._conversationRepo.update(conversation.id, {
      participantIds,
    });

    if (!updatedConversation) {
      throw new ConversationNotFoundError();
    }

    const participants = await this._participantRepo.getParticipants(conversation.id);

    this._logger.info("Group member removed", {
      conversationId: conversation.id,
      userId: request.userId,
    });

    return GroupResponseMapper.toResponse(updatedConversation, {
      currentUserId,
      participants,
    });
  }
}
