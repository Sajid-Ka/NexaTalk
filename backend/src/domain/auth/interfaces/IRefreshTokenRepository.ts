export interface RefreshTokenData {
  id?: string,
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  revoked?: boolean;
}

export interface IRefreshTokenRepository {
  save(token: RefreshTokenData): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenData | null>;
  revokeByHash(tokenHash: string): Promise<void>;
  deleteAllByUser(userId: string): Promise<void>;
  findActiveByUser(userId: string): Promise<RefreshTokenData[]>;
  revokeById(sessionId: string, userId: string) : Promise<void>;
}
