import { TransactionContext } from "../../../core/common/services/TransactionContext";
import { EmailVerificationToken } from "../entities/EmailVerificationToken";

export interface IEmailVerificationTokenRepository {
  save(token: EmailVerificationToken, transaction?: TransactionContext): Promise<void>;
  findByHash(tokenHash: string): Promise<EmailVerificationToken | null>;
  markAsUsed(id: string, transaction?: TransactionContext): Promise<void>;
  deleteAllByUser(userId: string, transaction?: TransactionContext): Promise<void>;
}
