import { RefreshTokenData } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { IRefreshTokenPersistence } from "../database/RefreshTokenModel";
import { IMapper } from "../../common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../shared/enums/database-field.enum";

export class RefreshTokenMapper implements IMapper<IRefreshTokenPersistence, RefreshTokenData> {
  toDomain(doc: IRefreshTokenPersistence): RefreshTokenData {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      revoked: doc.revoked,
      updatedAt: doc.updatedAt,
    };
  }

  toPersistence(data: RefreshTokenData): Omit<IRefreshTokenPersistence, OmittedDatabaseFields> {
    return {
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      revoked: data.revoked ?? false,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<RefreshTokenData>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.revoked !== undefined) update.revoked = partialDomain.revoked;
    if (partialDomain.ipAddress !== undefined) update.ipAddress = partialDomain.ipAddress;
    if (partialDomain.userAgent !== undefined) update.userAgent = partialDomain.userAgent;
    return update;
  }
}
