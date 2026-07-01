import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { FRIENDS_TYPES } from "../../../../main/di/modules/friends/friends.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IFriendRepository } from "../../../../domain/features/friends/repositories/IFriendRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { ConversationDomainService } from "../../../../domain/features/messages/services/ConversationDomainService";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { InvalidDirectConversationError } from "../../../../domain/features/messages/errors/InvalidDirectConversationError";
import { CreateDirectConversationRequest } from "../dtos/requests/CreateDirectConversationRequest";
import { ConversationResponse } from "../../shared/dtos/responses/ConversationResponse";
import { ConversationResponseMapper } from "../../shared/mappers/ConversationResponseMapper";
import { ICreateDirectConversationUsecase } from "../interfaces/ICreateDirectConversationUsecase";
import { Conversation } from "../../../../domain/features/messages/entities/Conversation";
import { User } from "../../../../domain/features/auth/entities/User";

@injectable()
export class CreateDirectConversation implements ICreateDirectConversationUsecase {
  constructor(
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(FRIENDS_TYPES.FriendRepository)
    private readonly _friendRepo: IFriendRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  private async getUser(userId: string): Promise<User> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return user;
  }

  private validateSelfConversation(userId: string, targetUserId: string): void {
    if (userId === targetUserId) {
      throw new InvalidDirectConversationError();
    }
  }

  private async validateBlockedUsers(userId: string, targetUserId: string): Promise<void> {
    const blocked = await this._friendRepo.checkIfBlocked(userId, targetUserId);

    if (blocked) {
      throw new ForbiddenError("Cannot create conversation with blocked user");
    }
  }

  private async findExistingConversation(directKey: string): Promise<Conversation | null> {
    return await this._conversationRepo.findByDirectKey(directKey);
  }

  private async persistConversation(
    conversation: Conversation,
    userId: string,
    targetUserId: string,
  ): Promise<Conversation> {
    let createdConversation: Conversation | null = null;

    await this._transactionManager.run(async (transaction) => {
      createdConversation = await this._conversationRepo.create(conversation, transaction);

      const participants = [
        new ConversationParticipant({
          conversationId: createdConversation.id,
          userId,
        }),

        new ConversationParticipant({
          conversationId: createdConversation.id,
          userId: targetUserId,
        }),
      ];

      await this._participantRepo.createMany(participants, transaction);
    });

    if (!createdConversation) {
      throw new Error("Conversation creation failed");
    }

    return createdConversation;
  }

  async execute(
    userId: string,
    request: CreateDirectConversationRequest,
  ): Promise<ConversationResponse> {
    this._logger.info("Creating direct conversation", {
      userId,
      targetUserId: request.targetUserId,
    });

    const currentUser = await this.getUser(userId);

    const targetUser = await this.getUser(request.targetUserId);

    this.validateSelfConversation(currentUser.id, targetUser.id);

    await this.validateBlockedUsers(currentUser.id, targetUser.id);

    const conversation = ConversationDomainService.createDirectConversation(
      currentUser.id,
      targetUser.id,
    );

    const existingConversation = await this.findExistingConversation(conversation.directKey!);

    if (existingConversation) {
      return ConversationResponseMapper.toResponse(existingConversation);
    }

    const createdConversation = await this.persistConversation(
      conversation,
      currentUser.id,
      targetUser.id,
    );

    this._logger.info("Direct conversation created", {
      conversationId: createdConversation.id,
    });

    return ConversationResponseMapper.toResponse(createdConversation);
  }
}
