import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IUploadGroupAvatarUsecase {
  execute(
    currentUserId: string,
    conversationId: string,
    file: Express.Multer.File,
  ): Promise<GroupResponse>;
}
