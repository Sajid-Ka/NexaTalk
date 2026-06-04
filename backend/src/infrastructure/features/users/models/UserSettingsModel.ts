import { Schema, model, Types } from "mongoose";

export interface IUserSettingsPersistence {
  _id: Types.ObjectId;
  userId: string;
  showRecommendations: boolean;
  allowFriendRecommendations: boolean;
  allowServerRecommendations: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSettingsSchema = new Schema<IUserSettingsPersistence>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    showRecommendations: {
      type: Boolean,
      required: true,
      default: true,
    },
    allowFriendRecommendations: {
      type: Boolean,
      required: true,
      default: true,
    },
    allowServerRecommendations: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "usersettings",
  },
);

export const UserSettingsModel = model<IUserSettingsPersistence>(
  "UserSettings",
  userSettingsSchema,
);
