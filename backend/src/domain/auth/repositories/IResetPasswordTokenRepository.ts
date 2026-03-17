import { ClientSession } from "mongoose";
import { ResetPasswordToken } from "../entities/ResetPasswordToken";

export interface IResetPasswordTokenRepository {
  save(token: ResetPasswordToken, session?: ClientSession): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<ResetPasswordToken | null>;
  markAsUsed(id: string, session?: ClientSession): Promise<void>;
  deleteByUserId(userId: string, session?: ClientSession): Promise<void>;
}
