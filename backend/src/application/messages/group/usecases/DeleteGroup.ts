import { inject, injectable } from "inversify";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { ConversationNotFoundError } from "../../../../domain/features/messages/errors/ConversationNotFoundError";
import { NotConversationParticipantError } from "../../../../domain/features/messages/errors/NotConversationParticipantError";
import { GroupOwnerRequiredError } from "../../../../domain/features/messages/errors/GroupOwnerRequiredError";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../../../domain/features/messages/repositories/IConversationParticipantRepository";
import { IMessageRepository } from "../../../../domain/features/messages/repositories/IMessageRepository";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupRole } from "../../../../shared/constants/group-role.const";
import { DeleteGroupRequest } from "../dtos/requests/DeleteGroupRequest";
import { IDeleteGroupUsecase } from "../interfaces/IDeleteGroupUsecase";

@injectable()
export class DeleteGroup implements IDeleteGroupUsecase {
  constructor(
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

  async execute(currentUserId: string, request: DeleteGroupRequest): Promise<void> {
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

    if (conversation.ownerId !== currentUserId || currentParticipant.role !== GroupRole.OWNER) {
      throw new GroupOwnerRequiredError();
    }

    await this._transactionManager.run(async (transaction) => {
      await this._messageRepo.deleteByConversation(conversation.id, transaction);
      await this._participantRepo.removeByConversation(conversation.id, transaction);
      await this._conversationRepo.delete(conversation.id, transaction);
    });

    this._logger.info("Group deleted", {
      conversationId: conversation.id,
      ownerId: currentUserId,
    });
  }
}
