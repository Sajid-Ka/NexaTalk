import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IMessageRepository } from "../../../domain/features/messages/repositories/IMessageRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../domain/features/auth/errors/UserNotFoundError";
import { MessageNotFoundError } from "../../../domain/features/messages/errors/MessageNotFoundError";
import { MessageEditForbiddenError } from "../../../domain/features/messages/errors/MessageEditForbiddenError";
import { ConversationDomainService } from "../../../domain/features/messages/services/ConversationDomainService";
import { EditMessageRequest } from "../dtos/requests/EditMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";
import { MessageResponseMapper } from "../mappers/MessageResponseMapper";
import { IEditMessageUsecase } from "../interfaces/IEditMessageUsecase";

@injectable()
export class EditMessage implements IEditMessageUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: EditMessageRequest): Promise<MessageResponse> {
    this._logger.info("Editing message", {
      userId,
      messageId: request.messageId,
    });

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const message = await this._messageRepo.findById(request.messageId);

    if (!message) {
      throw new MessageNotFoundError();
    }

    if (message.senderId !== user.id) {
      throw new MessageEditForbiddenError();
    }

    if (message.deletedAt) {
      throw new MessageNotFoundError();
    }

    ConversationDomainService.validateMessageContent(request.content);

    const updatedMessage = await this._messageRepo.update(message.id, {
      content: request.content.trim(),
      editedAt: new Date(),
      updatedAt: new Date(),
    });

    if (!updatedMessage) {
      throw new MessageNotFoundError();
    }

    this._logger.info("Message edited", {
      messageId: updatedMessage.id,
    });

    return MessageResponseMapper.toResponse(updatedMessage);
  }
}
