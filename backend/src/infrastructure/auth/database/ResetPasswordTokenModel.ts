import { Schema, model, Types } from "mongoose";

export interface IResetPasswordTokenPersistence {
  _id: Types.ObjectId;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const ResetPasswordTokenSchema = new Schema<IResetPasswordTokenPersistence>(
  {
    userId: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

ResetPasswordTokenSchema.index({ expiresAt: 1 });

export const ResetPasswordTokenModel = model<IResetPasswordTokenPersistence>(
  "ResetPasswordToken",
  ResetPasswordTokenSchema,
);
