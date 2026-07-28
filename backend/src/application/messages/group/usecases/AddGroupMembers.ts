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
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { InvalidConversationParticipantsError } from "../../../../domain/features/messages/errors/InvalidConversationParticipantsError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { ConversationParticipant } from "../../../../domain/features/messages/entities/ConversationParticipant";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { AddGroupMembersRequest } from "../dtos/requests/AddGroupMembersRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IAddGroupMembersUsecase } from "../interfaces/IAddGroupMembersUsecase";

@injectable()
export class AddGroupMembers implements IAddGroupMembersUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(FRIENDS_TYPES.FriendRepository)
    private readonly _friendRepo: IFriendRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(MESSAGES_TYPES.ConversationParticipantRepository)
    private readonly _participantRepo: IConversationParticipantRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(currentUserId: string, request: AddGroupMembersRequest): Promise<GroupResponse> {
    const conversation = await this._conversationRepo.findById(request.conversationId);

    if (!conversation || conversation.type !== ConversationType.GROUP) {
      throw new ConversationNotFoundError();
    }

    const currentParticipant = await this._participantRepo.findParticipant(
      conversation.id,
      currentUserId,
    );

    if (!currentParticipant) {
      throw new NotConversationParticipantError();
    }

    const canAddMembers =
      currentParticipant.role === GroupRole.OWNER || currentParticipant.role === GroupRole.ADMIN;

    if (!canAddMembers) {
      throw new ForbiddenError("Only group owners and admins can add members");
    }

    const uniqueParticipantIds = [...new Set(request.participantIds)]
      .filter((participantId) => participantId !== currentUserId)
      .filter((participantId) => !conversation.participantIds.includes(participantId));

    if (uniqueParticipantIds.length === 0) {
      throw new InvalidConversationParticipantsError();
    }

    const users = await this._userRepo.findByIds(uniqueParticipantIds);

    if (users.length !== uniqueParticipantIds.length) {
      throw new InvalidConversationParticipantsError();
    }

    const friendChecks = await Promise.all(
      uniqueParticipantIds.map((participantId) =>
        this._friendRepo.checkIfFriends(currentUserId, participantId),
      ),
    );

    if (friendChecks.some((isFriend) => !isFriend)) {
      throw new ForbiddenError("Only accepted friends can be added to the group");
    }

    const newParticipants = uniqueParticipantIds.map(
      (participantId) =>
        new ConversationParticipant({
          conversationId: conversation.id,
          userId: participantId,
          role: GroupRole.MEMBER,
        }),
    );

    const participantIds = [...conversation.participantIds, ...uniqueParticipantIds];

    let updatedConversation = conversation;

    await this._transactionManager.run(async (transaction) => {
      await this._participantRepo.createMany(newParticipants, transaction);

      const updated = await this._conversationRepo.update(
        conversation.id,
        { participantIds },
        transaction,
      );

      if (!updated) {
        throw new ConversationNotFoundError();
      }

      updatedConversation = updated;
    });

    const participants = await this._participantRepo.getParticipants(conversation.id);
    const responseUsers = await this._userRepo.findByIds(
      participants.map((participant) => participant.userId),
    );

    this._logger.info("Group members added", {
      conversationId: conversation.id,
      addedBy: currentUserId,
      participantIds: uniqueParticipantIds,
    });

    return GroupResponseMapper.toResponse(updatedConversation, {
      currentUserId,
      participants,
      users: responseUsers,
    });
  }
}
