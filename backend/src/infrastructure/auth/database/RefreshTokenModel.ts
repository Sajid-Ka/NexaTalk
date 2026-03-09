import {Schema,model,Types} from "mongoose";

export interface IRefreshTokenPersistence {
  _id : Types.ObjectId;
  userId : string;
  tokenHash : string;
  expiresAt : Date;
  ipAddress?: string;
  userAgent?: string;
  revoked : boolean;
  createdAt : Date;
  updatedAt : Date;
}

const refreshTokenSchema = new Schema<IRefreshTokenPersistence>(
  {
    userId: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

export const RefreshTokenModel = model<IRefreshTokenPersistence>("RefreshToken", refreshTokenSchema);
