import { Schema, model, Types } from "mongoose";

export interface IBlockedUserPersistence {
  _id: Types.ObjectId;
  blockerId: string;
  blockedUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

const blockedUserSchema = new Schema<IBlockedUserPersistence>(
  {
    blockerId: { type: String, required: true, index: true },
    blockedUserId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    collection: "blocked_users",
  },
);

// Unique compound index to prevent duplicate blocks
blockedUserSchema.index({ blockerId: 1, blockedUserId: 1 }, { unique: true });

export const BlockedUserModel = model<IBlockedUserPersistence>("BlockedUser", blockedUserSchema);
