import {
  IRefreshTokenRepository,
  RefreshTokenData,
} from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { RefreshTokenModel } from "../database/RefreshTokenModel";

export class MongoRefreshTokenRepository implements IRefreshTokenRepository {
  async save(token: RefreshTokenData): Promise<void> {
    await RefreshTokenModel.create(token);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenData | null> {
    const doc = await RefreshTokenModel.findOne({ tokenHash }).lean();
    if (!doc) return null;

    return {
      userId: doc.userId,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      ipAddress: doc.ipAddress ?? undefined,
      userAgent: doc.userAgent ?? undefined,
      revoked: doc.revoked ?? false,
    };
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    await RefreshTokenModel.updateOne({ tokenHash }, { $set: { revoked: true } });
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await RefreshTokenModel.deleteMany({ userId });
  }

  async findActiveByUser(userId: string): Promise<RefreshTokenData[]> {
    const docs = await RefreshTokenModel.find({
      userId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).lean();

    return docs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      ipAddress: doc.ipAddress ?? undefined,
      userAgent: doc.userAgent ?? undefined,
      revoked: doc.revoked ?? false,
    }));
  }

  async revokeById(sessionId: string, userId: string): Promise<void> {
    await RefreshTokenModel.updateOne(
      {_id: sessionId,userId},
      {revoked : true},
    );
  }
}
