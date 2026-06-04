import { Schema, model, Types } from "mongoose";

export interface IServerBanPersistence {
  _id: Types.ObjectId;
  serverId: string;
  userId: string;
  bannedBy: string;
  reason: string;
  createdAt: Date;
}

const serverBanSchema = new Schema<IServerBanPersistence>(
  {
    serverId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    bannedBy: { type: String, required: true },
    reason: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

serverBanSchema.index({ serverId: 1, userId: 1 }, { unique: true });
serverBanSchema.index({ serverId: 1, createdAt: -1 });

export const ServerBanModel = model<IServerBanPersistence>("ServerBan", serverBanSchema);
