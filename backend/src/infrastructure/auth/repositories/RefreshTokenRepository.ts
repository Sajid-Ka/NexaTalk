import { ClientSession } from "mongoose";
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

  async save(token: RefreshTokenData, session?: unknown): Promise<void> {
    const mongoSession = session as ClientSession | undefined;
    const persistence = RefreshTokenMapper.toPersistence(token);
    await this.createRaw(persistence,mongoSession);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenData | null> {
    const doc = await this.findOneRaw({ tokenHash });
    if (!doc) return null;

    return RefreshTokenMapper.toDomain(doc);
  }

  async revokeByHash(tokenHash: string, session?: unknown): Promise<void> {
    const mongoSession = (session as ClientSession | undefined) ?? null;
    await this.model
      .updateOne({ tokenHash }, { $set: { revoked: true } })
      .session(mongoSession)
      .exec();
  }

  async deleteAllByUser(userId: string, session?: unknown): Promise<void> {
    const mongoSession = (session as ClientSession | undefined) ?? null;
    await this.model
      .deleteMany({ userId })
      .session(mongoSession)
      .exec();
  }

  async findActiveByUser(userId: string): Promise<RefreshTokenData[]> {
    const docs = await this.model.find({
      userId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    }).lean();

    return docs.map(RefreshTokenMapper.toDomain);
  }

  async revokeById(sessionId: string, userId: string, session?: unknown): Promise<void> {
    const mongoSession = (session as ClientSession | undefined) ?? null;
    await this.model
      .updateOne({_id: sessionId,userId},{revoked : true})
      .session(mongoSession)
      .exec();
  }
}
