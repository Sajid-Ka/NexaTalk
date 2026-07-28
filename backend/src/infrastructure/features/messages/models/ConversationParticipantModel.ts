import { Schema, model, Types } from "mongoose";
import { GroupRole } from "../../../../shared/constants/group-role.const";

export interface IConversationParticipantPersistence {
  _id: Types.ObjectId;
  conversationId: string;
  userId: string;
  role: GroupRole;
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

    role: {
      type: String,
      enum: Object.values(GroupRole),
      default: GroupRole.MEMBER,
      required: true,
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
