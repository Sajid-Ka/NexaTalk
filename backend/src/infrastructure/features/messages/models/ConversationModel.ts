import { Schema, model, Types } from "mongoose";
import { ConversationType } from "../../../../shared/constants/conversation.const";

export interface IConversationPersistence {
  _id: Types.ObjectId;
  type: ConversationType;
  ownerId?: string;
  name?: string;
  avatar?: string;
  participantIds?: string[];
  directKey?: string;
  channelId?: string;
  lastMessageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversationPersistence>(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(ConversationType),
    },

    ownerId: {
      type: String,
    },

    name: {
      type: String,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
    },

    participantIds: {
      type: [String],
      default: [],
    },

    directKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    channelId: {
      type: String,
      index: true,
    },

    lastMessageId: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  },
);

conversationSchema.index({
  type: 1,
  participantIds: 1,
});

conversationSchema.index(
  {
    directKey: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

export const ConversationModel = model<IConversationPersistence>(
  "Conversation",
  conversationSchema,
);
