import { RenameGroupRequest } from "../dtos/requests/RenameGroupRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IRenameGroupUsecase {
  execute(currentUserId: string, request: RenameGroupRequest): Promise<GroupResponse>;
}
