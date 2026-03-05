import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import { ResetPasswordTokenModel,IResetPasswordTokenPersistence } from "../database/ResetPasswordTokenModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { injectable } from "inversify";

@injectable()

export class ResetPasswordTokenRepository extends BaseRepository<IResetPasswordTokenPersistence> implements IResetPasswordTokenRepository {
    
    constructor() {
        super(ResetPasswordTokenModel)
    }

    async save(token : ResetPasswordToken) : Promise<void> {
        await this.createRaw({
            userId : token.userId,
            tokenHash : token.tokenHash,
            expiresAt : token.expiresAt,
            used : token.used,
        });
    }

    async findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null> {
        const doc = await this.findOneRaw({tokenHash});
        if(!doc) return null;

        return new ResetPasswordToken({
            id: doc._id.toString(),
            userId: doc.userId,
            tokenHash: doc.tokenHash,
            expiresAt: doc.expiresAt,
            used: doc.used,
            createdAt: doc.createdAt
        })
    }

    async markAsUsed(id: string): Promise<void> {
        await this.updateRaw(id,{$set: { used : true}});
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.model.deleteMany({userId});
    }

}