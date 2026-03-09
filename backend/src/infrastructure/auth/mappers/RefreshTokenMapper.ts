import { RefreshTokenData } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IRefreshTokenPersistence } from "../database/RefreshTokenModel";

export class RefreshTokenMapper {
    static toPersistence(data: RefreshTokenData): Omit<IRefreshTokenPersistence, "_id" | "createdAt" | "updatedAt"> {
        return {
            userId: data.userId,
            tokenHash: data.tokenHash,
            expiresAt: data.expiresAt,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            revoked: data.revoked ?? false,
        }
    }

    static toDomain(doc: IRefreshTokenPersistence): RefreshTokenData {
        return {
            id: doc._id.toString(),
            userId: doc.userId,
            tokenHash: doc.tokenHash,
            expiresAt: doc.expiresAt,
            ipAddress: doc.ipAddress,
            userAgent: doc.userAgent,
            revoked: doc.revoked,
            updatedAt: doc.updatedAt,
        }
    }
}