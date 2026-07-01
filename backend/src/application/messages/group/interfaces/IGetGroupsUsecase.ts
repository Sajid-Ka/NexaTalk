import { GroupResponse } from "../dtos/responses/GroupResponse";

export interface IGetGroupsUsecase {
  execute(userId: string): Promise<GroupResponse[]>;
}
