import { CreateGroupRequest } from "../dtos/requests/CreateGroupRequest";
import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface ICreateGroupUsecase {
  execute(userId: string, request: CreateGroupRequest): Promise<GroupResponse>;
}
