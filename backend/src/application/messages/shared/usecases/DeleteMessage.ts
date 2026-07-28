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
import { MessageDeleteForbiddenError } from "../../../../domain/features/messages/errors/MessageDeleteForbiddenError";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { DeleteMessageRequest } from "../dtos/requests/DeleteMessageRequest";
import { MessageResponse } from "../dtos/responses/MessageResponse";
import { MessageResponseMapper } from "../mappers/MessageResponseMapper";
import { IDeleteMessageUsecase } from "../interfaces/IDeleteMessageUsecase";
import { CHANNELS_TYPES } from "../../../../main/di/modules/channels/channels.types";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IChannelRepository } from "../../../../domain/features/channels/repositories/IChannelRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";

@injectable()
export class DeleteMessage implements IDeleteMessageUsecase {
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
    @inject(CHANNELS_TYPES.ChannelRepository)
    private readonly _channelRepo: IChannelRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _serverMemberRepo: IServerMemberRepository,
  ) {}

  private async canDeleteChannelMessage(
    currentUserId: string,
    senderUserId: string,
    channelId?: string,
  ): Promise<boolean> {
    if (!channelId) {
      throw new NotFoundError("Channel not found");
    }

    const channel = await this._channelRepo.findById(channelId);

    if (!channel) {
      throw new NotFoundError("Channel not found");
    }

    const currentMember = await this._serverMemberRepo.findByServerAndUser(
      channel.serverId,
      currentUserId,
    );

    if (!currentMember) {
      throw new ConversationAccessDeniedError();
    }

    if (currentUserId === senderUserId) {
      return true;
    }

    const senderMember = await this._serverMemberRepo.findByServerAndUser(
      channel.serverId,
      senderUserId,
    );

    const senderRole = senderMember?.role ?? ServerMemberRole.MEMBER;

    if (currentMember.role === ServerMemberRole.OWNER) {
      return true;
    }

    if (currentMember.role === ServerMemberRole.ADMIN) {
      return senderRole !== ServerMemberRole.OWNER;
    }

    return false;
  }

  async execute(userId: string, request: DeleteMessageRequest): Promise<MessageResponse> {
    this._logger.info("Deleting message", {
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

    const conversation = await this._conversationRepo.findById(message.conversationId);

    if (!conversation) {
      throw new ConversationNotFoundError();
    }

    const isOwnMessage = message.senderId === user.id;
    let canDeleteMessage = isOwnMessage;

    if (conversation.type === ConversationType.CHANNEL) {
      canDeleteMessage = await this.canDeleteChannelMessage(
        user.id,
        message.senderId,
        conversation.channelId,
      );
    }

    if (conversation.type === ConversationType.GROUP) {
      const participant = await this._participantRepo.findParticipant(conversation.id, user.id);

      if (!participant) {
        throw new ConversationAccessDeniedError();
      }

      canDeleteMessage =
        isOwnMessage ||
        participant.role === GroupRole.OWNER ||
        participant.role === GroupRole.ADMIN;
    }

    if (!canDeleteMessage) {
      throw new MessageDeleteForbiddenError();
    }

    if (message.deletedAt) {
      return MessageResponseMapper.toResponse(message, user.id, user);
    }

    const updated = await this._messageRepo.update(message.id, {
      content: message.content,
      deletedAt: new Date(),
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new MessageNotFoundError();
    }

    this._logger.info("Message deleted", {
      messageId: updated.id,
      deletedBy: user.id,
    });

    return MessageResponseMapper.toResponse(updated, user.id, user);
  }
}
