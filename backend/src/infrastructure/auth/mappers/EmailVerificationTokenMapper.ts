import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { IEmailVerificationTokenPersistence } from "../database/EmailVerificationTokenModel";

export class EmailVerificationTokenMapper {
    static toDomain(doc : IEmailVerificationTokenPersistence) : EmailVerificationToken {
        return new EmailVerificationToken({
            id : doc._id.toString(),
            userId : doc.userId,
            tokenHash : doc.tokenHash,
            expiresAt : doc.expiresAt,
            used : doc.used,
            createdAt : doc.createdAt
        });
    }

    static toPersistence(entity: EmailVerificationToken) {
        return {
            userId: entity.userId,
            tokenHash: entity.tokenHash,
            expiresAt: entity.expiresAt,
            used: entity.used
        };
    }
}