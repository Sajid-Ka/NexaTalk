import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";

export interface IRegisterUserUsecase {
    execute(dto : RegisterUserRequest) : Promise<RegisterUserResponse>;
}