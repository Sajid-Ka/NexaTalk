import { AdminUserResponse } from "../dtos/response/AdminUserResponse";

export interface IGetUserDetailsUsecase {
  execute(userId: string): Promise<AdminUserResponse>;
}
