import { Schema, model, Types } from "mongoose";

export interface IConversationParticipantPersistence {
  _id: Types.ObjectId;
  conversationId: string;
  userId: string;
  lastReadMessageId?: string;
  joinedAt: Date;
}

const conversationParticipantSchema = new Schema<IConversationParticipantPersistence>(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    lastReadMessageId: {
      type: String,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "conversation_participants",
  },
);

conversationParticipantSchema.index(
  {
    conversationId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

export const ConversationParticipantModel = model<IConversationParticipantPersistence>(
  "ConversationParticipant",
  conversationParticipantSchema,
);
