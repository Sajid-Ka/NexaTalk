import { UserSettingsField } from "../../../../shared/constants/user-settings.const";
import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { UserSettings } from "../entities/UserSettings";

export interface IUserSettingsRepository extends IBaseRepository<UserSettings> {
  findByUserId(userId: string): Promise<UserSettings | null>;
  updateRecommendationSettings(
    userId: string,
    settings: Partial<
      Pick<UserSettings, (typeof UserSettingsField)[keyof typeof UserSettingsField]>
    >,
  ): Promise<UserSettings>;
}
