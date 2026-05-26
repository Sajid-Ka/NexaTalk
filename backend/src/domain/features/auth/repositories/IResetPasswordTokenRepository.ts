import { TransactionContext } from "../../../core/common/services/TransactionContext";
import { ResetPasswordToken } from "../entities/ResetPasswordToken";

export interface IResetPasswordTokenRepository {
  save(token: ResetPasswordToken, transaction?: TransactionContext): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null>;
  markAsUsed(id: string, transaction?: TransactionContext): Promise<void>;
  deleteByUserId(userId: string, transaction?: TransactionContext): Promise<void>;
}
