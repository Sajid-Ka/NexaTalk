import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";

export interface GoogleLoginRequest {
  idToken: string;
}

export interface IGoogleLoginUsecase {
  execute(dto: GoogleLoginRequest, ip?: string, ua?: string): Promise<LoginUserResponse>;
}
