import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { ConversationDomainService } from "../../../../domain/features/messages/services/ConversationDomainService";
import { DirectConversationResponse } from "../dtos/responses/DirectConversationResponse";
import { DirectConversationResponseMapper } from "../mappers/DirectConversationResponseMapper";
import { IGetDirectConversationsUsecase } from "../interfaces/IGetDirectConversationsUsecase";

@injectable()
export class GetDirectConversations implements IGetDirectConversationsUsecase {
  constructor(
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.MessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<DirectConversationResponse[]> {
    this._logger.info("Getting direct conversations", {
      userId,
    });

    const currentUser = await this._userRepo.findById(userId);

    if (!currentUser) {
      throw new UserNotFoundError(userId);
    }

    const conversations = await this._conversationRepo.findDirectByUser(userId);

    if (conversations.length === 0) {
      return [];
    }

    const targetUserIds = conversations.map((conversation) =>
      ConversationDomainService.getDirectTargetUserId(conversation, userId),
    );

    const users = await this._userRepo.findByIds(targetUserIds);

    const userMap = new Map(users.map((user) => [user.id, user]));

    const lastMessageMap = new Map<
      string,
      Awaited<ReturnType<IMessageRepository["findLatestVisibleByConversation"]>>
    >();

    await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await this._messageRepo.findLatestVisibleByConversation(
          conversation.id,
          userId,
        );

        lastMessageMap.set(conversation.id, lastMessage);
      }),
    );

    const response: DirectConversationResponse[] = [];

    for (const conversation of conversations) {
      const targetUserId = ConversationDomainService.getDirectTargetUserId(conversation, userId);

      const targetUser = userMap.get(targetUserId);

      if (!targetUser) {
        continue;
      }

      const lastMessage = lastMessageMap.get(conversation.id) ?? null;

      response.push(
        DirectConversationResponseMapper.toResponse(conversation, targetUser, lastMessage, 0),
      );
    }

    return response.sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) {
        return 0;
      }

      if (!a.lastMessageAt) {
        return 1;
      }

      if (!b.lastMessageAt) {
        return -1;
      }

      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
    });
  }
}
