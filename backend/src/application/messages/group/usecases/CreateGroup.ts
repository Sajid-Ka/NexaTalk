import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { InvalidConversationParticipantsError } from "../../../../domain/features/messages/errors/InvalidConversationParticipantsError";
import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { CreateGroupRequest } from "../dtos/requests/CreateGroupRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { ICreateGroupUsecase } from "../interfaces/ICreateGroupUsecase";

@injectable()
export class CreateGroup implements ICreateGroupUsecase {
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

  async execute(userId: string, request: CreateGroupRequest): Promise<GroupResponse> {
    this._logger.info("Creating group", { ownerId: userId });

    const owner = await this._userRepo.findById(userId);

    if (!owner) {
      throw new UserNotFoundError(userId);
    }

    const participantIds = [...new Set([...request.participantIds, userId])];

    const users = await this._userRepo.findByIds(participantIds);

    if (users.length !== participantIds.length) {
      throw new InvalidConversationParticipantsError();
    }

    const conversation = await this._conversationRepo.create(
      new Conversation({
        type: ConversationType.GROUP,
        ownerId: userId,
        name: request.name.trim(),
        avatar: request.avatar,
        participantIds,
      }),
    );

    const participants = participantIds.map(
      (participantId) =>
        new ConversationParticipant({
          conversationId: conversation.id,
          userId: participantId,
        }),
    );

    await this._participantRepo.createMany(participants);

    this._logger.info("Group created", {
      conversationId: conversation.id,
    });

    return GroupResponseMapper.toResponse(conversation);
  }
}
