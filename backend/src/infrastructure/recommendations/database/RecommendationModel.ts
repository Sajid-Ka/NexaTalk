import { Schema, model, Types } from "mongoose";

export interface IRecommendationPersistence {
  _id: Types.ObjectId;
  userId: string;
  recommendedUserIds: string[];
  recommendedServerIds: string[];
  lastRefreshedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendationPersistence>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    recommendedUserIds: [
      {
        type: String,
      },
    ],
    recommendedServerIds: [
      {
        type: String,
      },
    ],
    lastRefreshedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "recommendations",
  },
);

recommendationSchema.index({ lastRefreshedAt: 1 }); // Index for finding stale (Outdated) recommendations
recommendationSchema.index({ userId: 1 });

export const RecommendationModel = model<IRecommendationPersistence>(
  "Recommendation",
  recommendationSchema,
);
