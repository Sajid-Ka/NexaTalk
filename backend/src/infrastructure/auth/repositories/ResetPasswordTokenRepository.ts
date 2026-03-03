import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { ResetPasswordTokenModel,IResetPasswordTokenDocument } from "../database/ResetPasswordTokenModel";

export class ResetPasswordTokenRepository implements IResetPasswordTokenRepository {
    async save(token : ResetPasswordToken) : Promise<void> {
        await ResetPasswordTokenModel.create({
            userId : token.userId,
            tokenHash : token.tokenHash,
            expiresAt : token.expiresAt,
            used : token.used,
        });
    }

    async findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null> {
        const doc = await ResetPasswordTokenModel.findOne({tokenHash}).lean();
        if(!doc) return null;

        return this.toDomain(doc);
    }

    async markAsUsed(id: string): Promise<void> {
        await ResetPasswordTokenModel.findByIdAndUpdate(id, { used : true});
    }

    async deleteByUserId(userId: string): Promise<void> {
        await ResetPasswordTokenModel.deleteMany({userId});
    }

    private toDomain(doc : IResetPasswordTokenDocument) : ResetPasswordToken {
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