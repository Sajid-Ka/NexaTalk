import { ClientSession } from "mongoose";

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
  save(token: RefreshTokenData, session?: ClientSession): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenData | null>;
  revokeByHash(tokenHash: string, session?: ClientSession): Promise<void>;
  deleteAllByUser(userId: string, session?: ClientSession): Promise<void>;
  findActiveByUser(userId: string): Promise<RefreshTokenData[]>;
  revokeById(sessionId: string, userId: string, session?: ClientSession): Promise<void>;
  update(
    id: string,
    data: Partial<RefreshTokenData>,
    session?: ClientSession,
  ): Promise<RefreshTokenData | null>;
}
