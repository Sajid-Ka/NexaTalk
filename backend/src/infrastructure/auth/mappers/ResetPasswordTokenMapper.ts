import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { IResetPasswordTokenPersistence } from "../database/ResetPasswordTokenModel";

export class ResetPasswordTokenMapper {
    static toDomain(doc : IResetPasswordTokenPersistence) : ResetPasswordToken {
        return new ResetPasswordToken({
            id : doc._id.toString(),
            userId : doc.userId,
            tokenHash : doc.tokenHash,
            expiresAt : doc.expiresAt,
            used : doc.used,
            createdAt : doc.createdAt,
        })
    }
}