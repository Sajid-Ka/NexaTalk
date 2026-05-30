import { Schema, model, Types } from "mongoose";
import { ChannelType } from "../../../../shared/constants/channel.const";

export interface IChannelPersistence {
  _id: Types.ObjectId;
  serverId: string;
  name: string;
  type: ChannelType;
  createdBy: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema = new Schema<IChannelPersistence>(
  {
    serverId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(ChannelType),
      required: true,
      index: true,
    },
    createdBy: { type: String, required: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ChannelSchema.index({ serverId: 1, type: 1, position: 1 });
ChannelSchema.index({ serverId: 1, type: 1, name: 1 }, { unique: true });

export const ChannelModel = model<IChannelPersistence>("ServerChannel", ChannelSchema);
