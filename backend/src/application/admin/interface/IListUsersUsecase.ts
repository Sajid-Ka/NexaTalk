import { ListUsersRequestQuery } from "../dtos/request/ListUsersRequestQuery";
import { PaginatedUsersResponse } from "../dtos/response/PaginatedUsersResponse";

export interface IListUsersUsecase {
  execute(query: ListUsersRequestQuery): Promise<PaginatedUsersResponse>;
}
