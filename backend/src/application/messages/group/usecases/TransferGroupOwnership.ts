import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { GroupOwnerRequiredError } from "../../../../domain/features/messages/errors/GroupOwnerRequiredError";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { TransferGroupOwnershipRequest } from "../dtos/requests/TransferGroupOwnershipRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { ITransferGroupOwnershipUsecase } from "../interfaces/ITransferGroupOwnershipUsecase";

@injectable()
export class TransferGroupOwnership implements ITransferGroupOwnershipUsecase {
  constructor(
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
    currentUserId: string,
    request: TransferGroupOwnershipRequest,
  ): Promise<GroupResponse> {
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

    if (currentParticipant.role !== GroupRole.OWNER || conversation.ownerId !== currentUserId) {
      throw new GroupOwnerRequiredError();
    }

    if (request.newOwnerId === currentUserId) {
      throw new ForbiddenError("You already own this group");
    }

    const newOwnerParticipant = await this._participantRepo.findParticipant(
      conversation.id,
      request.newOwnerId,
    );

    if (!newOwnerParticipant) {
      throw new NotConversationParticipantError();
    }

    let updatedConversation = conversation;

    await this._transactionManager.run(async (transaction) => {
      await this._participantRepo.updateRole(
        conversation.id,
        currentUserId,
        GroupRole.ADMIN,
        transaction,
      );

      await this._participantRepo.updateRole(
        conversation.id,
        request.newOwnerId,
        GroupRole.OWNER,
        transaction,
      );

      const updated = await this._conversationRepo.update(
        conversation.id,
        {
          ownerId: request.newOwnerId,
        },
        transaction,
      );

      if (!updated) {
        throw new ConversationNotFoundError();
      }

      updatedConversation = updated;
    });

    const participants = await this._participantRepo.getParticipants(conversation.id);

    this._logger.info("Group ownership transferred", {
      conversationId: conversation.id,
      oldOwnerId: currentUserId,
      newOwnerId: request.newOwnerId,
    });

    return GroupResponseMapper.toResponse(updatedConversation, {
      currentUserId,
      participants,
    });
  }
}
