import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message : string, code : string = "BAD_REQUEST") {
        super(code,message,400);
    }
}