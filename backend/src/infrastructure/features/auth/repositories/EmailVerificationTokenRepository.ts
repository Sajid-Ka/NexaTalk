import { IEmailVerificationTokenRepository } from "../../../../domain/features/auth/repositories/IEmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../../domain/features/auth/entities/EmailVerificationToken";
import {
  EmailVerificationTokenModel,
  IEmailVerificationTokenPersistence,
} from "../database/EmailVerificationTokenModel";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { EmailVerificationTokenMapper } from "../mappers/EmailVerificationTokenMapper";

@injectable()
export class EmailVerificationTokenRepository
  extends BaseRepository<IEmailVerificationTokenPersistence, EmailVerificationToken>
  implements IEmailVerificationTokenRepository
{
  constructor() {
    super(EmailVerificationTokenModel, new EmailVerificationTokenMapper());
  }

  async save(token: EmailVerificationToken, session?: ClientSession): Promise<void> {
    await this.create(token, session);
  }

  async findByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    return this.findOne({ tokenHash } as Partial<EmailVerificationToken>);
  }

  async markAsUsed(id: string, session?: ClientSession): Promise<void> {
    await this.update(id, { used: true } as Partial<EmailVerificationToken>, session);
  }

  async deleteAllByUser(userId: string, session?: ClientSession): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(session ?? null)
      .exec();
  }
}
