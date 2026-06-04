import { Schema, model, Types } from "mongoose";
import { FriendsStatus } from "../../../../shared/constants/friends-status.const";

export interface IFriendPersistence {
  _id: Types.ObjectId;
  userId: string;
  friendId: string;
  status: FriendsStatus;
  createdAt: Date;
  updatedAt: Date;
}

const friendSchema = new Schema<IFriendPersistence>(
  {
    userId: { type: String, required: true, index: true },
    friendId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(FriendsStatus),
      required: true,
      default: FriendsStatus.PENDING,
    },
  },
  {
    timestamps: true,
    collection: "friends",
  },
);

// Unique compound index to prevent duplicate friendships
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
// Index for finding user's friends
friendSchema.index({ userId: 1, status: 1 });
friendSchema.index({ friendId: 1, status: 1 });

export const FriendModel = model<IFriendPersistence>("Friend", friendSchema);
