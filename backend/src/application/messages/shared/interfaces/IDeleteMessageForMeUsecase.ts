import { DeleteMessageForMeRequest } from "../dtos/requests/DeleteMessageForMeRequest";

export interface IDeleteMessageForMeUsecase {
  execute(userId: string, request: DeleteMessageForMeRequest): Promise<void>;
}
