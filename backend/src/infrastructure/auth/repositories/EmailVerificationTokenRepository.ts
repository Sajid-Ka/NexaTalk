import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { EmailVerificationTokenModel } from "../database/EmailVerificationTokenModel";

export class EmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
    async save(token : EmailVerificationToken) : Promise<void> {
        await EmailVerificationTokenModel.create({
            userId: token.userId,
            tokenHash : token.tokenHash,
            expiresAt : token.expiresAt,
            used : token.used,
        })
    }

    async findByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
        const doc = await EmailVerificationTokenModel.findOne({tokenHash}).lean();
        if(!doc) return null;

        return new EmailVerificationToken({
            id: doc._id.toString(),
            userId : doc.userId,
            tokenHash : doc.tokenHash,
            expiresAt : doc.expiresAt,
            used : doc.used,
            createdAt :  doc.createdAt,
        })
    }

    async markAsUsed(id: string): Promise<void> {
        await EmailVerificationTokenModel.updateOne(
            {_id : id},
            {$set : {used : true}}
        );
    }

    async deleteAllByUser(userId: string): Promise<void> {
        await EmailVerificationTokenModel.deleteMany({userId});
    }
}