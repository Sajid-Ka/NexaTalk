import { ClientSession } from "mongoose";
import { EmailVerificationToken } from "../entities/EmailVerificationToken";

export interface IEmailVerificationTokenRepository {
  save(token: EmailVerificationToken, session?: ClientSession): Promise<void>;
  findByHash(tokenHash: string): Promise<EmailVerificationToken | null>;
  markAsUsed(id: string, session?: ClientSession): Promise<void>;
  deleteAllByUser(userId: string, session?: ClientSession): Promise<void>;
}
