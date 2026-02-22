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
        };
    }

    async deleteByHash(tokenHash: string): Promise<void> {
        await RefreshTokenModel.deleteOne({ tokenHash });
    }

    async deleteAllByUser(userId: string): Promise<void> {
        await RefreshTokenModel.deleteMany({ userId });
    }
}
