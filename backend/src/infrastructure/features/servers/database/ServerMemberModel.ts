import { Schema, model, Types } from "mongoose";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

export interface IServerMemberPersistence {
  _id: Types.ObjectId;
  serverId: string;
  userId: string;
  role: ServerMemberRole;
  joinedAt: Date;
  updatedAt: Date;
}

const serverMemberSchema = new Schema<IServerMemberPersistence>(
  {
    serverId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: Object.values(ServerMemberRole),
      required: true,
      default: ServerMemberRole.MEMBER,
    },
  },
  { timestamps: { createdAt: "joinedAt", updatedAt: "updatedAt" } },
);

serverMemberSchema.index({ serverId: 1, userId: 1 }, { unique: true });
serverMemberSchema.index({ serverId: 1, role: 1 });
serverMemberSchema.index({ userId: 1, joinedAt: -1 });

export const ServerMemberModel = model<IServerMemberPersistence>(
  "ServerMember",
  serverMemberSchema,
);
