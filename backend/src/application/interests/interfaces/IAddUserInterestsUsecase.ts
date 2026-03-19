import { AddUserInterestsRequest } from "../dtos/requests/AddUserInterestsRequest";
import { InterestResponse } from "../dtos/responses/InterestResponse";

export interface IAddUserInterestsUseCase {
  execute(userId: string, request: AddUserInterestsRequest): Promise<InterestResponse[]>;
}
