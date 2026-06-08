import { EmailVerificationToken } from "../../../../domain/features/auth/entities/EmailVerificationToken";
import { IEmailVerificationTokenPersistence } from "../models/EmailVerificationTokenModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class EmailVerificationTokenMapper implements IMapper<
  IEmailVerificationTokenPersistence,
  EmailVerificationToken
> {
  toDomain(doc: IEmailVerificationTokenPersistence): EmailVerificationToken {
    return new EmailVerificationToken({
      id: doc._id.toString(),
      userId: doc.userId,
      newEmail: doc.newEmail,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      used: doc.used,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(
    entity: EmailVerificationToken,
  ): Omit<IEmailVerificationTokenPersistence, OmittedDatabaseFields> {
    return {
      userId: entity.userId,
      newEmail: entity.newEmail,
      tokenHash: entity.tokenHash,
      expiresAt: entity.expiresAt,
      used: entity.used,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<EmailVerificationToken>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.used !== undefined) update.used = partialDomain.used;
    return update;
  }
}
