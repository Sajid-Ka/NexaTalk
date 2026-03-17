import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { IResetPasswordTokenPersistence } from "../database/ResetPasswordTokenModel";
import { IMapper } from "../../common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../shared/constants/database-field.const";

export class ResetPasswordTokenMapper implements IMapper<
  IResetPasswordTokenPersistence,
  ResetPasswordToken
> {
  toDomain(doc: IResetPasswordTokenPersistence): ResetPasswordToken {
    return new ResetPasswordToken({
      id: doc._id.toString(),
      userId: doc.userId,
      tokenHash: doc.tokenHash,
      expiresAt: doc.expiresAt,
      used: doc.used,
      createdAt: doc.createdAt,
    });
  }

  toPersistence(
    token: ResetPasswordToken,
  ): Omit<IResetPasswordTokenPersistence, OmittedDatabaseFields> {
    return {
      userId: token.userId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      used: token.used,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<ResetPasswordToken>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.used !== undefined) update.used = partialDomain.used;
    return update;
  }
}
