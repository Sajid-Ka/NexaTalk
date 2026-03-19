import { InterestResponse } from "../dtos/responses/InterestResponse";

export interface IGetPopularInterestsUseCase {
  execute(limit?: number): Promise<InterestResponse[]>;
}
