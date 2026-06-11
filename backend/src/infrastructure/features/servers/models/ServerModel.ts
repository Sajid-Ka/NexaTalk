import { Schema, model, Types } from "mongoose";
import { ServerPrivacy, ServerTag, SERVER_TAGS } from "../../../../shared/constants/server.const";

export interface IServerPersistence {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  privacy: ServerPrivacy;
  isDisabled: boolean;
  memberCount: number;
  channelCount?: number;
  ownerName?: string;
  tag: ServerTag;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const serverSchema = new Schema<IServerPersistence>(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, maxlength: 500 },
    icon: { type: String, default: "" },
    banner: { type: String, default: "" },
    ownerId: { type: String, required: true, index: true },
    privacy: {
      type: String,
      enum: Object.values(ServerPrivacy),
      required: true,
      default: ServerPrivacy.PUBLIC,
    },
    isDisabled: { type: Boolean, default: false },
    memberCount: { type: Number, default: 1 },
    tag: { type: String, enum: SERVER_TAGS, required: true, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

serverSchema.index({ name: "text" });
serverSchema.index({ ownerId: 1, createdAt: -1 });
serverSchema.index({ privacy: 1, memberCount: -1 });
serverSchema.index({ tag: 1, privacy: 1 });

export const ServerModel = model<IServerPersistence>("Server", serverSchema);
