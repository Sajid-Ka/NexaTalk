import { Schema, model, Types } from "mongoose";
import { ServerValidation } from "../../../../shared/constants/server.const";

export interface IServerInvitePersistence {
  _id: Types.ObjectId;
  serverId: string;
  code: string;
  createdBy: string;
  maxUses: number;
  expiresAt?: Date | null;
  uses: number;
  createdAt: Date;
}

const serverInviteSchema = new Schema<IServerInvitePersistence>(
  {
    serverId: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, index: true },
    createdBy: { type: String, required: true },
    maxUses: { type: Number, default: ServerValidation.DEFAULT_INVITE_MAX_USES },
    expiresAt: { type: Date, default: null },
    uses: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

serverInviteSchema.index({ expiresAt: 1 });
serverInviteSchema.index({ serverId: 1, createdAt: -1 });

export const ServerInviteModel = model<IServerInvitePersistence>("ServerInvite", serverInviteSchema);