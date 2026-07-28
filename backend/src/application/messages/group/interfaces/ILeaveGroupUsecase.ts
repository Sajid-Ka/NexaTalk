import { LeaveGroupRequest } from "../dtos/requests/LeaveGroupRequest";

export interface ILeaveGroupUsecase {
  execute(currentUserId: string, request: LeaveGroupRequest): Promise<void>;
}
