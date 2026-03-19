import { UserSettings } from "../../../domain/features/users/entities/UserSettings";
import { UserSettingsResponse } from "../dtos/responses/UserSettingsResponse";

export class UserSettingsMapper {
  static toResponse(settings: UserSettings): UserSettingsResponse {
    return {
      showRecommendations: settings.showRecommendations,
      allowFriendRecommendations: settings.allowFriendRecommendations,
      allowServerRecommendations: settings.allowServerRecommendations,
      updatedAt: settings.updatedAt,
    };
  }
}
