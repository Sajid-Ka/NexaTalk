import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { MessageNotFoundError } from "../../../../domain/features/messages/errors/MessageNotFoundError";
import { ConversationAccessDeniedError } from "../../../../domain/features/messages/errors/ConversationAccessDeniedError";
import { MarkAsReadRequest } from "../dtos/requests/MarkAsReadRequest";
import { MarkAsReadResponse } from "../dtos/responses/MarkAsReadResponse";
import { MarkAsReadResponseMapper } from "../mappers/MarkAsReadResponseMapper";
import { IMarkAsReadUsecase } from "../interfaces/IMarkAsReadUsecase";

@injectable()
export class MarkAsRead implements IMarkAsReadUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: MarkAsReadRequest): Promise<MarkAsReadResponse> {
    this._logger.info("Marking messages as read", {
      userId,
      conversationId: request.conversationId,
    });

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const message = await this._messageRepo.findById(request.messageId);

    if (!message) {
      throw new MessageNotFoundError();
    }

    const participant = await this._participantRepo.findParticipant(request.conversationId, userId);

    if (!participant) {
      throw new ConversationAccessDeniedError();
    }

    await this._participantRepo.markRead(request.conversationId, userId, request.messageId);

    this._logger.info("Conversation marked as read", {
      conversationId: request.conversationId,
      userId,
    });

    return MarkAsReadResponseMapper.toResponse(request.conversationId, request.messageId);
  }
}
