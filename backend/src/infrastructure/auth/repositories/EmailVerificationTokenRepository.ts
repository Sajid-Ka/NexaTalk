import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { EmailVerificationTokenModel,IEmailVerificationTokenPersistence } from "../database/EmailVerificationTokenModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { EmailVerificationTokenMapper } from "../mappers/EmailVerificationTokenMapper";

@injectable()
export class EmailVerificationTokenRepository extends BaseRepository<IEmailVerificationTokenPersistence> implements IEmailVerificationTokenRepository {
    constructor(){
        super(EmailVerificationTokenModel)
    }

    async save(token : EmailVerificationToken, session?: unknown) : Promise<void> {

        const mongoSession = session as ClientSession | undefined;

        await this.createRaw(
            EmailVerificationTokenMapper.toPersistence(token),
            mongoSession
        )
    }

    async findByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
        const doc = await this.findOneRaw({tokenHash});
        if(!doc) return null;

        return EmailVerificationTokenMapper.toDomain(doc);
    }

    async markAsUsed(id: string, session?: unknown): Promise<void> {
        const mongoSession = session as ClientSession | undefined;

        await this.updateRaw(id, {$set : {used : true}}, mongoSession);
    }

    async deleteAllByUser(userId: string, session?: unknown): Promise<void> {
        const mongoSession = (session as ClientSession | undefined) ?? null;

        await this.model
            .deleteMany({userId})
            .session(mongoSession)
            .exec();
    }
}