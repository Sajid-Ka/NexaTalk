import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { CHANNELS_TYPES } from "../../../../main/di/modules/channels/channels.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { IChannelRepository } from "../../../../domain/features/channels/repositories/IChannelRepository";
import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { ChannelType } from "../../../../shared/constants/channel.const";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { ConversationResponse } from "../../shared/dtos/responses/ConversationResponse";
import { ConversationResponseMapper } from "../../shared/mappers/ConversationResponseMapper";
import { GetChannelConversationRequest } from "../dtos/requests/GetChannelConversationRequest";
import { IGetChannelConversationUsecase } from "../interfaces/IGetChannelConversationUsecase";

@injectable()
export class GetChannelConversation implements IGetChannelConversationUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(CHANNELS_TYPES.ChannelRepository)
    private readonly _channelRepo: IChannelRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(
    userId: string,
    request: GetChannelConversationRequest,
  ): Promise<ConversationResponse> {
    this._logger.info("Getting channel conversation", {
      userId,
      serverId: request.serverId,
      channelId: request.channelId,
    });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const server = await this._serverRepo.findById(request.serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    const member = await this._memberRepo.findByServerAndUser(request.serverId, userId);
    if (!member) {
      throw new NotMemberError();
    }

    const channel = await this._channelRepo.findById(request.channelId);
    if (!channel || channel.serverId !== request.serverId) {
      throw new NotFoundError("Channel not found");
    }

    if (channel.type !== ChannelType.TEXT) {
      throw new BadRequestError("Only text channels can have chat conversations");
    }

    const existingConversation = await this._conversationRepo.findByChannelId(channel.id);
    if (existingConversation) {
      await this.ensureParticipant(existingConversation.id, userId);
      return ConversationResponseMapper.toResponse(existingConversation);
    }

    const conversation = await this._transactionManager.run(async (transaction) => {
      const createdConversation = await this._conversationRepo.create(
        new Conversation({
          type: ConversationType.CHANNEL,
          name: channel.name,
          channelId: channel.id,
          participantIds: [userId],
        }),
        transaction,
      );

      await this._participantRepo.createMany(
        [
          new ConversationParticipant({
            conversationId: createdConversation.id,
            userId,
          }),
        ],
        transaction,
      );

      return createdConversation;
    });

    this._logger.info("Channel conversation ready", {
      conversationId: conversation.id,
      channelId: channel.id,
    });

    return ConversationResponseMapper.toResponse(conversation);
  }

  private async ensureParticipant(conversationId: string, userId: string): Promise<void> {
    const participant = await this._participantRepo.findParticipant(conversationId, userId);

    if (participant) {
      return;
    }

    await this._participantRepo.create(
      new ConversationParticipant({
        conversationId,
        userId,
      }),
    );
  }
}
