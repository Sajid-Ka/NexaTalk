export interface RefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface IRefreshTokenRepository {
  save(token: RefreshTokenData): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenData | null>;
  deleteByHash(tokenHash: string): Promise<void>;
  deleteAllByUser(userId: string): Promise<void>;
}
