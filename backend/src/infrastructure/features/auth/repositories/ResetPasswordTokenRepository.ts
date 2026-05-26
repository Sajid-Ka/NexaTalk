import { IResetPasswordTokenRepository } from "../../../../domain/features/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../../domain/features/auth/entities/ResetPasswordToken";
import {
  ResetPasswordTokenModel,
  IResetPasswordTokenPersistence,
} from "../database/ResetPasswordTokenModel";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { injectable } from "inversify";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";
import { ResetPasswordTokenMapper } from "../mappers/ResetPasswordTokenMapper";

@injectable()
export class ResetPasswordTokenRepository
  extends BaseRepository<IResetPasswordTokenPersistence, ResetPasswordToken>
  implements IResetPasswordTokenRepository
{
  constructor() {
    super(ResetPasswordTokenModel, new ResetPasswordTokenMapper());
  }

  async save(token: ResetPasswordToken, transaction?: TransactionContext): Promise<void> {
    await this.create(token, transaction);
  }

  async findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null> {
    return this.findOne({ tokenHash } as Partial<ResetPasswordToken>);
  }

  async markAsUsed(id: string, transaction?: TransactionContext): Promise<void> {
    await this.update(id, { used: true } as Partial<ResetPasswordToken>, transaction);
  }

  async deleteByUserId(userId: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(toMongoSession(transaction) ?? null)
      .exec();
  }
}
