import mongoose, { Document, Schema } from "mongoose";

export interface IServerDirectInviteDoc extends Document {
  serverId: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const ServerDirectInviteSchema = new Schema(
  {
    serverId: { type: Schema.Types.ObjectId, ref: "Server", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true },
);

ServerDirectInviteSchema.index(
  { serverId: 1, receiverId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);

export const ServerDirectInviteModel = mongoose.model<IServerDirectInviteDoc>(
  "ServerDirectInvite",
  ServerDirectInviteSchema,
);
