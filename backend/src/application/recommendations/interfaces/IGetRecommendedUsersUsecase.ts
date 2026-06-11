import { RecommendedUserResponse } from "../dtos/responses/RecommendedUserResponse";

export interface IGetRecommendedUsersUsecase {
  execute(userId: string, limit?: number): Promise<RecommendedUserResponse[]>;
}
