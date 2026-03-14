import { SessionListResponse } from "../dtos/responses/SessionListResponse";

export interface IListUserSessionsUsecase {
  execute(userId: string): Promise<SessionListResponse[]>;
}
