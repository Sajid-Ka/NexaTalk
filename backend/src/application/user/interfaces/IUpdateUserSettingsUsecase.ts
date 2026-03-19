import { UpdateUserSettingsRequest } from "../dtos/requests/UpdateUserSettingsRequest";
import { UserSettingsResponse } from "../dtos/responses/UserSettingsResponse";

export interface IUpdateUserSettingsUsecase {
  execute(userId: string, request: UpdateUserSettingsRequest): Promise<UserSettingsResponse>;
}
