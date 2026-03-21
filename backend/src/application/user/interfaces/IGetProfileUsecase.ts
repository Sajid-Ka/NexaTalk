import { ProfileResponse, PublicProfileResponse } from "../dtos/responses/ProfileResponse";

export interface IGetProfileUsecase {
  execute(
    targetUserId: string,
    requestingUserId?: string,
  ): Promise<ProfileResponse | PublicProfileResponse>;
}
