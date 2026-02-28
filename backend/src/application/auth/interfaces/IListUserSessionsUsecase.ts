import { SessionListResponse } from "../dtos/responses/SessionListResponse";

export interface IListUserSessionUsecase {
    execute(userId : string) : Promise<SessionListResponse[]>;
}