import { Schema, model, Types } from "mongoose";

export interface IUserPersistence {
  _id : Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  status: "online" | "idle" | "offline";
  globalRole: "user" | "admin";
  isProfilePublic: boolean;
  isBlocked: boolean;
  blockedReason?: string | null;
  lastSeenAt?: Date | null;
  createdAt : Date;
  updatedAt : Date;
  deletedAt?: Date | null;
  isEmailVerified : boolean;
}

const userSchema = new Schema<IUserPersistence>(
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
    isEmailVerified : {type : Boolean, default : false},
  },
  { timestamps: true },
);

userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUserPersistence>("User", userSchema);
