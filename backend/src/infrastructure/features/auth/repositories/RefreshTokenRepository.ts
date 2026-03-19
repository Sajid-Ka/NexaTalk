import { ClientSession } from "mongoose";
import {
  IRefreshTokenRepository,
  RefreshTokenData,
} from "../../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { IRefreshTokenPersistence, RefreshTokenModel } from "../database/RefreshTokenModel";
import { RefreshTokenMapper } from "../mappers/RefreshTokenMapper";
import { injectable } from "inversify";

@injectable()
export class RefreshTokenRepository
  extends BaseRepository<IRefreshTokenPersistence, RefreshTokenData>
  implements IRefreshTokenRepository
{
  constructor() {
    super(RefreshTokenModel, new RefreshTokenMapper());
  }

  async save(token: RefreshTokenData, session?: ClientSession): Promise<void> {
    await this.create(token, session);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenData | null> {
    return this.findOne({ tokenHash } as Partial<RefreshTokenData>);
  }

  async revokeByHash(tokenHash: string, session?: ClientSession): Promise<void> {
    await this.model
      .updateOne({ tokenHash }, { $set: { revoked: true } })
      .session(session ?? null)
      .exec();
  }

  async deleteAllByUser(userId: string, session?: ClientSession): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(session ?? null)
      .exec();
  }

  async findActiveByUser(userId: string): Promise<RefreshTokenData[]> {
    const docs = await this.model
      .find({
        userId,
        revoked: false,
        expiresAt: { $gt: new Date() },
      })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async revokeById(sessionId: string, userId: string, session?: ClientSession): Promise<void> {
    await this.model
      .updateOne({ _id: sessionId, userId }, { revoked: true })
      .session(session ?? null)
      .exec();
  }

  async update(
    id: string,
    data: Partial<RefreshTokenData>,
    session?: ClientSession,
  ): Promise<RefreshTokenData | null> {
    // If revoking, use the dedicated method
    if (data.revoked) {
      const token = await this.findById(id);
      if (token?.userId) {
        await this.revokeById(id, token.userId, session);
        return this.findById(id);
      }
    }

    // Otherwise do normal update
    const updateData = this.mapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, { $set: updateData }, session);
    return updated ? this.mapper.toDomain(updated) : null;
  }
}
