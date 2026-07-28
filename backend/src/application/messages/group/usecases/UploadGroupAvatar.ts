import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IUploadGroupAvatarUsecase } from "../interfaces/IUploadGroupAvatarUsecase";

@injectable()
export class UploadGroupAvatar implements IUploadGroupAvatarUsecase {
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

  async execute(
    currentUserId: string,
    conversationId: string,
    file: Express.Multer.File,
  ): Promise<GroupResponse> {
    if (!file) {
      throw new BadRequestError("No avatar uploaded");
    }

    const conversation = await this._conversationRepo.findById(conversationId);

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

    const canEditGroup =
      currentParticipant.role === GroupRole.OWNER || currentParticipant.role === GroupRole.ADMIN;

    if (!canEditGroup) {
      throw new ForbiddenError("Only group owners and admins can change group avatar");
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    const updatedConversation = await this._conversationRepo.update(conversation.id, {
      avatar: avatarUrl,
    });

    if (!updatedConversation) {
      throw new ConversationNotFoundError();
    }

    const participants = await this._participantRepo.getParticipants(conversation.id);
    const users = await this._userRepo.findByIds(
      participants.map((participant) => participant.userId),
    );

    this._logger.info("Group avatar uploaded", {
      conversationId: conversation.id,
      updatedBy: currentUserId,
      avatar: avatarUrl,
    });

    return GroupResponseMapper.toResponse(updatedConversation, {
      currentUserId,
      participants,
      users,
    });
  }
}
