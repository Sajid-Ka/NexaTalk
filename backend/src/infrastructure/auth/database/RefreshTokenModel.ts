import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String, default: false },
    userAgent: { type: String, default: false },
    revoked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);
