import { Schema, model, Types } from "mongoose";

export interface IUserInterestPersistence {
  _id: Types.ObjectId;
  userId: string;
  interestId: string;
  createdAt: Date;
}

const userInterestSchema = new Schema<IUserInterestPersistence>(
  {
    userId: {
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
    collection: "userinterests",
  },
);

userInterestSchema.index({ userId: 1, interestId: 1 }, { unique: true }); // Unique compound index to prevent duplicate interests per user
userInterestSchema.index({ interestId: 1, userId: 1 }); // Index for finding users by interest

export const UserInterestModel = model<IUserInterestPersistence>(
  "UserInterest",
  userInterestSchema,
);
