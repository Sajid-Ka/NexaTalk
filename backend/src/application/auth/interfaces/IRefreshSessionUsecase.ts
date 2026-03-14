import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";

export interface IRefreshSessionUsecase {
  execute(refreshToken: string): Promise<RefreshTokenResponse>;
}
