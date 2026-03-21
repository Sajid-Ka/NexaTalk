import { UpdateProfileRequest } from "../dtos/requests/UpdateProfileRequest";
import { ProfileResponse } from "../dtos/responses/ProfileResponse";

export interface IUpdateProfileUsecase {
  execute(userId: string, request: UpdateProfileRequest): Promise<ProfileResponse>;
}
