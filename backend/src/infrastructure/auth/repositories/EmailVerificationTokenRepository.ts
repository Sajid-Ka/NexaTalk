import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { EmailVerificationTokenModel,IEmailVerificationTokenPersistence } from "../database/EmailVerificationTokenModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { injectable } from "inversify";

@injectable()

export class EmailVerificationTokenRepository extends BaseRepository<IEmailVerificationTokenPersistence> implements IEmailVerificationTokenRepository {
    constructor(){
        super(EmailVerificationTokenModel)
    }

    async save(token : EmailVerificationToken) : Promise<void> {
        await this.createRaw({
            userId: token.userId,
            tokenHash : token.tokenHash,
            expiresAt : token.expiresAt,
            used : token.used,
        })
    }

    async findByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
        const doc = await this.findOneRaw({tokenHash});
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
        await this.updateRaw(id, {$set : {used : true}});
    }

    async deleteAllByUser(userId: string): Promise<void> {
        await this.model.deleteMany({userId});
    }
}