import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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

export const UserModel = mongoose.model("User", userSchema);
