import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";
import {
  IRefreshTokenRepository,
  RefreshTokenData,
} from "../../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { IRefreshTokenPersistence, RefreshTokenModel } from "../models/RefreshTokenModel";
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

  async save(token: RefreshTokenData, transaction?: TransactionContext): Promise<void> {
    await this.create(token, transaction);
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenData | null> {
    return this.findOne({ tokenHash } as Partial<RefreshTokenData>);
  }

  async revokeByHash(tokenHash: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .updateOne({ tokenHash }, { $set: { revoked: true } })
      .session(toMongoSession(transaction) ?? null)
      .exec();
  }

  async deleteAllByUser(userId: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(toMongoSession(transaction) ?? null)
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

  async revokeById(
    sessionId: string,
    userId: string,
    transaction?: TransactionContext,
  ): Promise<void> {
    await this.model
      .updateOne({ _id: sessionId, userId }, { revoked: true })
      .session(toMongoSession(transaction) ?? null)
      .exec();
  }

  async update(
    id: string,
    data: Partial<RefreshTokenData>,
    transaction?: TransactionContext,
  ): Promise<RefreshTokenData | null> {
    // If revoking, use the dedicated method
    if (data.revoked) {
      const token = await this.findById(id);
      if (token?.userId) {
        await this.revokeById(id, token.userId, transaction);
        return this.findById(id);
      }
    }

    // Otherwise do normal update
    const updateData = this.mapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, { $set: updateData }, transaction);
    return updated ? this.mapper.toDomain(updated) : null;
  }
}
