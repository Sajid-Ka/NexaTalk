import {IRefreshTokenRepository,RefreshTokenData,} from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { BaseRepository } from "../../common/database/BaseRepository";
import { IRefreshTokenPersistence, RefreshTokenModel } from "../database/RefreshTokenModel";
import { RefreshTokenMapper } from "../mappers/RefreshTokenMapper";
import { injectable } from "inversify";

@injectable()

export class RefreshTokenRepository extends BaseRepository<IRefreshTokenPersistence> implements IRefreshTokenRepository {
  constructor(){
    super(RefreshTokenModel);
  }

  async save(token: RefreshTokenData): Promise<void> {
    const persistence = RefreshTokenMapper.toPersistence(token);
    await this.createRaw(persistence);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenData | null> {
    const doc = await this.findOneRaw({ tokenHash });
    if (!doc) return null;

    return RefreshTokenMapper.toDomain(doc);
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    await this.model.updateOne({ tokenHash }, { $set: { revoked: true } });
  }

  async deleteAllByUser(userId: string): Promise<void> {
    await this.model.deleteMany({ userId });
  }

  async findActiveByUser(userId: string): Promise<RefreshTokenData[]> {
    const docs = await this.model.find({
      userId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).lean();

    return docs.map(RefreshTokenMapper.toDomain);
  }

  async revokeById(sessionId: string, userId: string): Promise<void> {
    await this.model.updateOne(
      {_id: sessionId,userId},
      {revoked : true},
    );
  }
}
