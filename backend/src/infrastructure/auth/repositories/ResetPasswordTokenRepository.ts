import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/auth/entities/ResetPasswordToken";
import {
  ResetPasswordTokenModel,
  IResetPasswordTokenPersistence,
} from "../database/ResetPasswordTokenModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { ResetPasswordTokenMapper } from "../mappers/ResetPasswordTokenMapper";

@injectable()
export class ResetPasswordTokenRepository
  extends BaseRepository<IResetPasswordTokenPersistence, ResetPasswordToken>
  implements IResetPasswordTokenRepository
{
  constructor() {
    super(ResetPasswordTokenModel, new ResetPasswordTokenMapper());
  }

  async save(token: ResetPasswordToken, session?: ClientSession): Promise<void> {
    await this.create(token, session);
  }

  async findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null> {
    return this.findOne({ tokenHash } as Partial<ResetPasswordToken>);
  }

  async markAsUsed(id: string, session?: ClientSession): Promise<void> {
    await this.update(id, { used: true } as Partial<ResetPasswordToken>, session);
  }

  async deleteByUserId(userId: string, session?: ClientSession): Promise<void> {
    await this.model
      .deleteMany({ userId })
      .session(session ?? null)
      .exec();
  }
}
