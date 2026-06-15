import { UserPreviewResponse } from "../dtos/responses/UserPreviewResponse";

export interface IGetUserPreviewUsecase {
  execute(targetUserId: string, requestingUserId: string): Promise<UserPreviewResponse>;
}
