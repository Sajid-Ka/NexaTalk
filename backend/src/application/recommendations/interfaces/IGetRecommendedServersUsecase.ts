import { RecommendedServerResponse } from "../dtos/responses/RecommendedServerResponse";

export interface IGetRecommendedServersUsecase {
  execute(userId: string, limit?: number): Promise<RecommendedServerResponse[]>;
}
