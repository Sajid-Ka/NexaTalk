import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { ConversationAccessDeniedError } from "../../../../domain/features/messages/errors/ConversationAccessDeniedError";
import { Message } from "../../../../domain/features/messages/entities/Message";
import { ConversationDomainService } from "../../../../domain/features/messages/services/ConversationDomainService";
import { SendMessageRequest } from "../dtos/requests/SendMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";
import { MessageResponseMapper } from "../mappers/MessageResponseMapper";
import { ISendMessageUsecase } from "../interfaces/ISendMessageUsecase";

@injectable()
export class SendMessage implements ISendMessageUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: SendMessageRequest): Promise<MessageResponse> {
    this._logger.info("Sending message", {
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

    ConversationDomainService.validateMessageContent(request.content);

    const message = new Message({
      conversationId: conversation.id,
      senderId: user.id,
      content: request.content.trim(),
    });

    let createdMessage = message;

    await this._transactionManager.run(async (transaction) => {
      createdMessage = await this._messageRepo.create(message, transaction);

      await this._conversationRepo.update(
        conversation.id,
        {
          lastMessageId: createdMessage.id,
        },
        transaction,
      );
    });

    this._logger.info("Message sent", {
      messageId: createdMessage.id,
    });

    return MessageResponseMapper.toResponse(createdMessage, user.id, user);
  }
}
