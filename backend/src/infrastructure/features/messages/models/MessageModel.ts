import { Schema, model, Types } from "mongoose";

export interface IMessagePersistence {
  _id: Types.ObjectId;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
}

const messageSchema = new Schema<IMessagePersistence>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: String,
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "messages",
  },
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

export const MessageModel = model<IMessagePersistence>("Message", messageSchema);
