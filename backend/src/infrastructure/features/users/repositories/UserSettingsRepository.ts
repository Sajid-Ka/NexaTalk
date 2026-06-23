import { injectable } from "inversify";
import { UserSettings } from "../../../../domain/features/users/entities/UserSettings";
import { IUserSettingsRepository } from "../../../../domain/features/users/repositories/IUserSettingsRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { UserSettingsModel, IUserSettingsPersistence } from "../models/UserSettingsModel";
import { UserSettingsMapper } from "../mappers/UserSettingsMapper";
import { UserSettingsField } from "../../../../shared/constants/user.const";

@injectable()
export class UserSettingsRepository
  extends BaseRepository<IUserSettingsPersistence, UserSettings>
  implements IUserSettingsRepository
{
  constructor() {
    super(UserSettingsModel, new UserSettingsMapper());
  }

  async findByUserId(userId: string): Promise<UserSettings | null> {
    return this.findOne({ userId } as Partial<UserSettings>);
  }

  async updateRecommendationSettings(
    userId: string,
    settings: Partial<
      Pick<UserSettings, (typeof UserSettingsField)[keyof typeof UserSettingsField]>
    >,
  ): Promise<UserSettings> {
    const existing = await this.findByUserId(userId);

    if (existing) {
      const updated = await this.update(existing.id, settings);
      return updated!;
    }

    // Create default settings if none exist
    const newSettings = new UserSettings({
      userId,
      showRecommendations: settings.showRecommendations ?? true,
      allowFriendRecommendations: settings.allowFriendRecommendations ?? true,
      allowServerRecommendations: settings.allowServerRecommendations ?? true,
    });

    return this.create(newSettings);
  }
}
