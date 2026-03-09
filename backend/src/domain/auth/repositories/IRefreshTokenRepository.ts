export interface RefreshTokenData {
  id?: string,
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  revoked?: boolean;
  updatedAt?: Date;
}

export interface IRefreshTokenRepository {
  save(token: RefreshTokenData, session?: unknown): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenData | null>;
  revokeByHash(tokenHash: string, session?: unknown): Promise<void>;
  deleteAllByUser(userId: string, session?: unknown): Promise<void>;
  findActiveByUser(userId: string): Promise<RefreshTokenData[]>;
  revokeById(sessionId: string, userId: string, session?: unknown): Promise<void>;
}
