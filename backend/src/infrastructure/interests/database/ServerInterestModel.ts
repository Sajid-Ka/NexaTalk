import { Schema, model, Types } from "mongoose";

export interface IServerInterestPersistence {
  _id: Types.ObjectId;
  serverId: string;
  interestId: string;
  createdAt: Date;
}

const serverInterestSchema = new Schema<IServerInterestPersistence>(
  {
    serverId: {
      type: String,
      required: true,
      index: true,
    },
    interestId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "serverinterests",
  },
);

serverInterestSchema.index({ serverId: 1, interestId: 1 }, { unique: true }); // Unique compound index to prevent duplicate interests per server
serverInterestSchema.index({ interestId: 1, serverId: 1 }); // Index for finding servers by interest

export const ServerInterestModel = model<IServerInterestPersistence>(
  "ServerInterest",
  serverInterestSchema,
);
