import { ChangeEmailRequest } from "../dtos/requests/ChangeEmailRequest";

export interface IChangeEmailUsecase {
  execute(userId: string, request: ChangeEmailRequest): Promise<void>;
}
