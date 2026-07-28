import { DeleteGroupRequest } from "../dtos/requests/DeleteGroupRequest";

export interface IDeleteGroupUsecase {
  execute(currentUserId: string, request: DeleteGroupRequest): Promise<void>;
}
