import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { MESSAGES_TYPES } from "../../../../main/di/modules/messages/messages.types";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { IConversationRepository } from "../../../../domain/features/messages/repositories/IConversationRepository";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { UserNotFoundError } from "../../../../domain/features/auth/errors/UserNotFoundError";
import { ConversationType } from "../../../../shared/constants/conversation.const";
import { GroupResponse } from "../dtos/responses/GroupResponse";
import { GroupResponseMapper } from "../mappers/GroupResponseMapper";
import { IGetGroupsUsecase } from "../interfaces/IGetGroupsUsecase";

@injectable()
export class GetGroups implements IGetGroupsUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(MESSAGES_TYPES.ConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(COMMON_TYPES.Logger)
    private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<GroupResponse[]> {
    this._logger.info("Getting groups", {
      userId,
    });

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const conversations = await this._conversationRepo.findGroupsByUser(userId);

    return conversations
      .filter((conversation) => conversation.type === ConversationType.GROUP)
      .map(GroupResponseMapper.toResponse);
  }
}
