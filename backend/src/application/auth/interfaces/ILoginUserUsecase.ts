import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";

export interface ILoginUserUsecase {
    execute(
        dto: LoginUserRequest,
        ipAddress?: string,
        userAgent?: string,
    ) : Promise <LoginUserResponse>;
}