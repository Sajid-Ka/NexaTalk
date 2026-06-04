import { IEmailVerificationTokenRepository } from "../../../../domain/features/auth/repositories/IEmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../../domain/features/auth/entities/EmailVerificationToken";
import {
  EmailVerificationTokenModel,
  IEmailVerificationTokenPersistence,
} from "../models/EmailVerificationTokenModel";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { injectable } from "inversify";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";
import { EmailVerificationTokenMapper } from "../mappers/EmailVerificationTokenMapper";

@injectable()
export class EmailVerificationTokenRepository
  extends BaseRepository<IEmailVerificationTokenPersistence, EmailVerificationToken>
  implements IEmailVerificationTokenRepository
{
  constructor() {
    super(EmailVerificationTokenModel, new EmailVerificationTokenMapper());
  }

  async save(token: EmailVerificationToken, transaction?: TransactionContext): Promise<void> {
    await this.create(token, transaction);
  }

  async findByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    return this.findOne({ tokenHash } as Partial<EmailVerificationToken>);
  }

  async markAsUsed(id: string, transaction?: TransactionContext): Promise<void> {
    await this.update(id, { used: true } as Partial<EmailVerificationToken>, transaction);
  }

  async deleteAllByUser(userId: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(toMongoSession(transaction) ?? null)
      .exec();
  }
}
