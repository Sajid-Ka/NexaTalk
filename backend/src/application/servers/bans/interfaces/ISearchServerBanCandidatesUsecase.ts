import { ServerBanCandidateResponse } from "../dtos/responses/ServerBanCandidateResponse";

export interface ISearchServerBanCandidatesUsecase {
  execute(
    serverId: string,
    currentUserId: string,
    query: string,
  ): Promise<ServerBanCandidateResponse[]>;
}
