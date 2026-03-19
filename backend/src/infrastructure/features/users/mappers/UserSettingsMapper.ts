import { UserSettings } from "../../../../domain/features/users/entities/UserSettings";
import { IUserSettingsPersistence } from "../database/UserSettingsModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class UserSettingsMapper implements IMapper<IUserSettingsPersistence, UserSettings> {
  toDomain(doc: IUserSettingsPersistence): UserSettings {
    return new UserSettings({
      id: doc._id.toString(),
      userId: doc.userId,
      showRecommendations: doc.showRecommendations,
      allowFriendRecommendations: doc.allowFriendRecommendations,
      allowServerRecommendations: doc.allowServerRecommendations,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: UserSettings): Omit<IUserSettingsPersistence, OmittedDatabaseFields> {
    return {
      userId: entity.userId,
      showRecommendations: entity.showRecommendations,
      allowFriendRecommendations: entity.allowFriendRecommendations,
      allowServerRecommendations: entity.allowServerRecommendations,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<UserSettings>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.showRecommendations !== undefined)
      update.showRecommendations = partialDomain.showRecommendations;
    if (partialDomain.allowFriendRecommendations !== undefined)
      update.allowFriendRecommendations = partialDomain.allowFriendRecommendations;
    if (partialDomain.allowServerRecommendations !== undefined)
      update.allowServerRecommendations = partialDomain.allowServerRecommendations;
    return update;
  }
}
