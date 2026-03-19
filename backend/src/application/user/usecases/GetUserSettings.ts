import { inject, injectable } from "inversify";
import { USER_TYPES } from "../../../main/di/modules/user/user.types";
import { IUserSettingsRepository } from "../../../domain/features/users/repositories/IUserSettingsRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { UserSettingsResponse } from "../dtos/responses/UserSettingsResponse";
import { IGetUserSettingsUsecase } from "../interfaces/IGetUserSettingsUsecase";

@injectable()
export class GetUserSettings implements IGetUserSettingsUsecase {
  constructor(
    @inject(USER_TYPES.UserSettingsRepository)
    private readonly _settingsRepo: IUserSettingsRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<UserSettingsResponse> {
    this._logger.info("Getting user settings", { userId });

    let settings = await this._settingsRepo.findByUserId(userId);

    // Create default settings if none exist
    if (!settings) {
      settings = await this._settingsRepo.updateRecommendationSettings(userId, {});
    }

    return {
      showRecommendations: settings.showRecommendations,
      allowFriendRecommendations: settings.allowFriendRecommendations,
      allowServerRecommendations: settings.allowServerRecommendations,
      updatedAt: settings.updatedAt,
    };
  }
}
