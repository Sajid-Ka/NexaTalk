import { SearchUserResponse } from "../dtos/responses/SearchUserResponse";

export interface ISearchUsersUsecase {
  execute(query: string, limit: number, excludeUserId?: string): Promise<SearchUserResponse[]>;
}
