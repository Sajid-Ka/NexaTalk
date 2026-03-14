import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { IEmailVerificationTokenPersistence } from "../database/EmailVerificationTokenModel";
import { IMapper } from "../../common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../shared/enums/database-field.enum";

export class EmailVerificationTokenMapper implements IMapper<
  IEmailVerificationTokenPersistence,
  EmailVerificationToken
> {
  toDomain(doc: IEmailVerificationTokenPersistence): EmailVerificationToken {
    return new EmailVerificationToken({
      id: doc._id.toString(),
      userId: doc.userId,
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
