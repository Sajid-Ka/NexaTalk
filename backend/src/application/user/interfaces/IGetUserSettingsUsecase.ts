import { UserSettingsResponse } from "../dtos/responses/UserSettingsResponse";

export interface IGetUserSettingsUsecase {
  execute(userId: string): Promise<UserSettingsResponse>;
}
