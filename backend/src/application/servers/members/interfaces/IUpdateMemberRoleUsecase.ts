import { UpdateMemberRoleRequest } from "../dtos/requests/UpdateMemberRoleRequest";

export interface IUpdateMemberRoleUsecase {
  execute(
    serverId: string,
    currentUserId: string,
    targetUserId: string,
    request: UpdateMemberRoleRequest,
  ): Promise<void>;
}