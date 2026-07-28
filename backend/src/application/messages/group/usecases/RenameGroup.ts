import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { RenameGroupRequest } from "../dtos/requests/RenameGroupRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IRenameGroupUsecase } from "../interfaces/IRenameGroupUsecase";

@injectable()
export class RenameGroup implements IRenameGroupUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(currentUserId: string, request: RenameGroupRequest): Promise<GroupResponse> {
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

    const canRename =
      currentParticipant.role === GroupRole.OWNER || currentParticipant.role === GroupRole.ADMIN;

    if (!canRename) {
      throw new ForbiddenError("Only group owners and admins can rename the group");
    }

    const updatedConversation = await this._conversationRepo.update(conversation.id, {
      name: request.name.trim(),
    });

    if (!updatedConversation) {
      throw new ConversationNotFoundError();
    }

    const participants = await this._participantRepo.getParticipants(conversation.id);
    const users = await this._userRepo.findByIds(
      participants.map((participant) => participant.userId),
    );

    this._logger.info("Group renamed", {
      conversationId: conversation.id,
      updatedBy: currentUserId,
      name: request.name.trim(),
    });

    return GroupResponseMapper.toResponse(updatedConversation, {
      currentUserId,
      participants,
      users,
    });
  }
}
