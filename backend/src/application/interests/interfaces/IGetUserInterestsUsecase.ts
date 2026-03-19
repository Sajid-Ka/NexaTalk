import { InterestResponse } from "../dtos/responses/InterestResponse";

export interface IGetUserInterestsUseCase {
  execute(userId: string): Promise<InterestResponse[]>;
}
