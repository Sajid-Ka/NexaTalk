import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        tokenHash: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
        ipAddress: String,
        userAgent: String,
    },
    { timestamps: true }
);

export const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);
