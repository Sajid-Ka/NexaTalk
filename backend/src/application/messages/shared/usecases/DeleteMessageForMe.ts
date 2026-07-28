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
import { MessageNotFoundError } from "../../../../domain/features/messages/errors/MessageNotFoundError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { ConversationAccessDeniedError } from "../../../../domain/features/messages/errors/ConversationAccessDeniedError";
import { DeleteMessageForMeRequest } from "../dtos/requests/DeleteMessageForMeRequest";
import { IDeleteMessageForMeUsecase } from "../interfaces/IDeleteMessageForMeUsecase";

@injectable()
export class DeleteMessageForMe implements IDeleteMessageForMeUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: DeleteMessageForMeRequest): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new UserNotFoundError(userId);

    const message = await this._messageRepo.findById(request.messageId);
    if (!message) throw new MessageNotFoundError();

    const conversation = await this._conversationRepo.findById(message.conversationId);
    if (!conversation) throw new ConversationNotFoundError();

    const participant = await this._participantRepo.findParticipant(conversation.id, userId);
    if (!participant) throw new ConversationAccessDeniedError();

    await this._messageRepo.hideForUser(message.id, userId);

    this._logger.info("Message hidden for user", {
      userId,
      messageId: message.id,
    });
  }
}
