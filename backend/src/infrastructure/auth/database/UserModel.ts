import { Schema, model, Document } from "mongoose";

export interface IUserDocument extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  globalRole: "user" | "admin";
  isProfilePublic: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  lastSeenAt?: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    status: {
      type: String,
      enum: ["online", "idle", "offline"],
      default: "offline",
    },

    globalRole: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isProfilePublic: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: null },
    lastSeenAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel = model<IUserDocument>("User", userSchema);
