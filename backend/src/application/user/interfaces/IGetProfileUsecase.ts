import { ProfileResponse } from "../dtos/responses/ProfileResponse";
import { PublicProfileResponse } from "../dtos/responses/PublicProfileResponse";

export interface IGetProfileUsecase {
  execute(
    targetUserId: string,
    requestingUserId?: string,
  ): Promise<ProfileResponse | PublicProfileResponse>;
}
