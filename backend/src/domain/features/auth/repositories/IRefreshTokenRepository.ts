import { TransactionContext } from "../../../core/common/services/TransactionContext";

export interface RefreshTokenData {
  id?: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  revoked?: boolean;
  updatedAt?: Date;
}

export interface IRefreshTokenRepository {
  save(token: RefreshTokenData, transaction?: TransactionContext): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenData | null>;
  revokeByHash(tokenHash: string, transaction?: TransactionContext): Promise<void>;
  deleteAllByUser(userId: string, transaction?: TransactionContext): Promise<void>;
  findActiveByUser(userId: string): Promise<RefreshTokenData[]>;
  revokeById(sessionId: string, userId: string, transaction?: TransactionContext): Promise<void>;
  update(
    id: string,
    data: Partial<RefreshTokenData>,
    transaction?: TransactionContext,
  ): Promise<RefreshTokenData | null>;
}
