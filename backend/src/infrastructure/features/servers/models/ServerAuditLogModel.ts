import { Schema, model, Types } from "mongoose";

export interface IServerAuditLogPersistence {
  _id: Types.ObjectId;
  serverId: string;
  actorId: string;
  action: string;
  targetId?: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const serverAuditLogSchema = new Schema<IServerAuditLogPersistence>(
  {
    serverId: { type: String, required: true, index: true },
    actorId: { type: String, required: true },
    action: { type: String, required: true, index: true },
    targetId: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

serverAuditLogSchema.index({ serverId: 1, createdAt: -1 });

export const ServerAuditLogModel = model<IServerAuditLogPersistence>(
  "ServerAuditLog",
  serverAuditLogSchema,
);
