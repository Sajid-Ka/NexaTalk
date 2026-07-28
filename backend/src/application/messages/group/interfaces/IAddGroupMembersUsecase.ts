import { AddGroupMembersRequest } from "../dtos/requests/AddGroupMembersRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IAddGroupMembersUsecase {
  execute(currentUserId: string, request: AddGroupMembersRequest): Promise<GroupResponse>;
}
