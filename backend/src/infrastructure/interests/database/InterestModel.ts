import { Schema, model, Types } from "mongoose";
import { InterestCategory } from "../../../shared/constants/interests.const";

export interface IInterestPersistence {
  _id: Types.ObjectId;
  name: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const interestSchema = new Schema<IInterestPersistence>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(InterestCategory),
      default: InterestCategory.OTHER,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "interests",
  },
);

interestSchema.index({ name: "text" }); // Text search index for name field
interestSchema.index({ category: 1, name: 1 });

export const InterestModel = model<IInterestPersistence>("Interest", interestSchema);
