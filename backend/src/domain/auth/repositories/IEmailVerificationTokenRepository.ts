import { EmailVerificationToken } from "../entities/EmailVerificationToken";

export interface IEmailVerificationTokenRepository {
    save(token : EmailVerificationToken, session?: unknown) : Promise<void>;
    findByHash(tokenHash : string) : Promise<EmailVerificationToken | null>;
    markAsUsed(id : string, session?: unknown) : Promise<void>;
    deleteAllByUser(userId : string, session?: unknown) : Promise<void>;
}