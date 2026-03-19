import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { IUserSettingsRepository } from "../../../domain/features/users/repositories/IUserSettingsRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { UpdateUserSettingsRequest } from "../dtos/requests/UpdateUserSettingsRequest";
import { UserSettingsResponse } from "../dtos/responses/UserSettingsResponse";

@injectable()
export class UpdateUserSettings {
  constructor(
    @inject(USER_TYPES.UserSettingsRepository)
    private readonly _settingsRepo: IUserSettingsRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: UpdateUserSettingsRequest): Promise<UserSettingsResponse> {
    this._logger.info("Updating user settings", { userId, request });

    const settings = await this._settingsRepo.updateRecommendationSettings(userId, {
      showRecommendations: request.showRecommendations,
      allowFriendRecommendations: request.allowFriendRecommendations,
      allowServerRecommendations: request.allowServerRecommendations,
    });

    return {
      showRecommendations: settings.showRecommendations,
      allowFriendRecommendations: settings.allowFriendRecommendations,
      allowServerRecommendations: settings.allowServerRecommendations,
      updatedAt: settings.updatedAt,
    };
  }
}
