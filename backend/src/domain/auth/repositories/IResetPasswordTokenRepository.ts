import { ResetPasswordToken } from "../entities/ResetPasswordToken";

export interface IResetPasswordTokenRepository {
    save(token : ResetPasswordToken, session?: unknown) : Promise<void>;
    findByTokenHash(tokenHash : string) : Promise<ResetPasswordToken | null>;
    markAsUsed(id :  string, session?: unknown) : Promise<void>;
    deleteByUserId(userId : string, session?: unknown) : Promise<void>;
}