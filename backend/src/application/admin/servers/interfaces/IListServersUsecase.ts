import { ListServersRequestQuery } from "../dtos/requests/ListServersRequestQuery";
import { PaginatedServersResponse } from "../dtos/responses/PaginatedServersResponse";

export interface IListServersUsecase {
  execute(query: ListServersRequestQuery): Promise<PaginatedServersResponse>;
}