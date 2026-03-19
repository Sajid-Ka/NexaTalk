import { InterestResponse } from "../dtos/responses/InterestResponse";
import { SearchInterestsQuery } from "../dtos/requests/SearchInterestsQuery";

export interface ISearchInterestsUseCase {
  execute(query: SearchInterestsQuery): Promise<InterestResponse[]>;
}
