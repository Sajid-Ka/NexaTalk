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
import { UpdateGroupMemberRoleRequest } from "../dtos/requests/UpdateGroupMemberRoleRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IUpdateGroupMemberRoleUsecase } from "../interfaces/IUpdateGroupMemberRoleUsecase";

@injectable()
export class UpdateGroupMemberRole implements IUpdateGroupMemberRoleUsecase {
  constructor(
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(
    currentUserId: string,
    request: UpdateGroupMemberRoleRequest,
  ): Promise<GroupResponse> {
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

    if (currentParticipant.role !== GroupRole.OWNER) {
      throw new ForbiddenError("Only the group owner can promote or demote members");
    }

    if (request.userId === conversation.ownerId) {
      throw new CannotRemoveGroupOwnerError();
    }

    if (![GroupRole.ADMIN, GroupRole.MEMBER].includes(request.role)) {
      throw new ForbiddenError("Invalid group role");
    }

    const targetParticipant = await this._participantRepo.findParticipant(
      conversation.id,
      request.userId,
    );

    if (!targetParticipant) {
      throw new NotConversationParticipantError();
    }

    await this._participantRepo.updateRole(conversation.id, request.userId, request.role);

    const participants = await this._participantRepo.getParticipants(conversation.id);

    this._logger.info("Group member role updated", {
      conversationId: conversation.id,
      userId: request.userId,
      role: request.role,
    });

    return GroupResponseMapper.toResponse(conversation, {
      currentUserId,
      participants,
    });
  }
}
