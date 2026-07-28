import { UpdateGroupMemberRoleRequest } from "../dtos/requests/UpdateGroupMemberRoleRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IUpdateGroupMemberRoleUsecase {
  execute(currentUserId: string, request: UpdateGroupMemberRoleRequest): Promise<GroupResponse>;
}
