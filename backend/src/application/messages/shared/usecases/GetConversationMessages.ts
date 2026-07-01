import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { ConversationAccessDeniedError } from "../../../../domain/features/messages/errors/ConversationAccessDeniedError";
import { GetConversationMessagesRequest } from "../dtos/requests/GetConversationMessagesRequest";
import { MessagePageResponse } from "../dtos/responses/MessagePageResponse";
import { MessageItemResponseMapper } from "../mappers/MessageItemResponseMapper";
import { IGetConversationMessagesUsecase } from "../interfaces/IGetConversationMessagesUsecase";

@injectable()
export class GetConversationMessages implements IGetConversationMessagesUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(
    userId: string,
    request: GetConversationMessagesRequest,
  ): Promise<MessagePageResponse> {
    this._logger.info("Getting conversation messages", {
      userId,
      conversationId: request.conversationId,
    });

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const conversation = await this._conversationRepo.findById(request.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    const participant = await this._participantRepo.findParticipant(request.conversationId, userId);

    if (!participant) {
      throw new ConversationAccessDeniedError();
    }

    const page = await this._messageRepo.findByConversation(
      request.conversationId,
      request.limit,
      request.cursor,
    );

    return {
      messages: page.messages.map((message) =>
        MessageItemResponseMapper.toResponse(message, userId),
      ),

      nextCursor: page.nextCursor,

      hasMore: page.hasMore,
    };
  }
}
