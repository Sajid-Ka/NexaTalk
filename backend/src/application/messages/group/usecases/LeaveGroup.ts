import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { CannotLeaveAsOwnerError } from "../../../../domain/features/messages/errors/CannotLeaveAsOwnerError";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { LeaveGroupRequest } from "../dtos/requests/LeaveGroupRequest";
import { ILeaveGroupUsecase } from "../interfaces/ILeaveGroupUsecase";

@injectable()
export class LeaveGroup implements ILeaveGroupUsecase {
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

  async execute(currentUserId: string, request: LeaveGroupRequest): Promise<void> {
    const conversation = await this._conversationRepo.findById(request.conversationId);

    if (!conversation || conversation.type !== ConversationType.GROUP) {
      throw new ConversationNotFoundError();
    }

    const participant = await this._participantRepo.findParticipant(conversation.id, currentUserId);

    if (!participant) {
      throw new NotConversationParticipantError();
    }

    if (participant.role === GroupRole.OWNER || conversation.ownerId === currentUserId) {
      throw new CannotLeaveAsOwnerError();
    }

    const participantIds = conversation.participantIds.filter(
      (participantId) => participantId !== currentUserId,
    );

    await this._transactionManager.run(async (transaction) => {
      await this._participantRepo.removeParticipant(conversation.id, currentUserId, transaction);

      await this._conversationRepo.update(
        conversation.id,
        {
          participantIds,
        },
        transaction,
      );
    });

    this._logger.info("Group member left", {
      conversationId: conversation.id,
      userId: currentUserId,
    });
  }
}
