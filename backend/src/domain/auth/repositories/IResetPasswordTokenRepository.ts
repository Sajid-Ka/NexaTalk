import { ResetPasswordToken } from "../entities/ResetPasswordToken";

export interface IResetPasswordTokenRepository {
    save(token : ResetPasswordToken) : Promise<void>;
    findByTokenHash(tokenHash : string) : Promise<ResetPasswordToken | null>;
    markAsUsed(id :  string) : Promise<void>;
    deleteByUserId(userId : string) : Promise<void>;
}