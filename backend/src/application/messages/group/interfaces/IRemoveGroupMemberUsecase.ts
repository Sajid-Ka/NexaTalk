import { RemoveGroupMemberRequest } from "../dtos/requests/RemoveGroupMemberRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IRemoveGroupMemberUsecase {
  execute(currentUserId: string, request: RemoveGroupMemberRequest): Promise<GroupResponse>;
}
