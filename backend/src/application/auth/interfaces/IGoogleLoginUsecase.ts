import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { GoogleLoginRequest } from "../dtos/requests/GoogleLoginRequest";

export interface IGoogleLoginUsecase {
  execute(dto: GoogleLoginRequest, ip?: string, ua?: string): Promise<LoginUserResponse>;
}
