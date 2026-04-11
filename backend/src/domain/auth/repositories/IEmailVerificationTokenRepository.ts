import { EmailVerificationToken } from "../../features/auth/entities/EmailVerificationToken";

export interface IEmailVerificationTokenRepository {
  save(token: EmailVerificationToken): Promise<void>;
  findByHash(tokenHash: string): Promise<EmailVerificationToken | null>;
  markAsUsed(id: string): Promise<void>;
  deleteAllByUser(userId: string): Promise<void>;
}
