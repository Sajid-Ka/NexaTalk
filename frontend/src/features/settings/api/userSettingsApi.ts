import { api } from "../../../shared/api/axios";

export interface UserSettingsResponse {
  showRecommendations: boolean;
  allowFriendRecommendations: boolean;
  allowServerRecommendations: boolean;
  updatedAt: string;
}

export interface UpdateUserSettingsRequest {
  showRecommendations?: boolean;
  allowFriendRecommendations?: boolean;
  allowServerRecommendations?: boolean;
}

export const getUserSettingsApi = () => 
  api.get<{ data: UserSettingsResponse }>("/user/settings");

export const updateUserSettingsApi = (data: UpdateUserSettingsRequest) => 
  api.patch<{ data: UserSettingsResponse }>("/user/settings", data);