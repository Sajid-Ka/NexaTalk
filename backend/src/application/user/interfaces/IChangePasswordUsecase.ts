import { ChangePasswordRequest } from "../dtos/requests/ChangePasswordRequest";

export interface IChangePasswordUsecase {
  execute(userId: string, request: ChangePasswordRequest): Promise<void>;
}
