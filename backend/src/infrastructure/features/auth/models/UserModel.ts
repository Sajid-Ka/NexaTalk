import { Schema, model, Types } from "mongoose";
import { UserPresenceStatus } from "../../../../shared/constants/user.const";
import { GlobalRole } from "../../../../shared/constants/user.const";

export interface IUserPersistence {
  _id: Types.ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  status: UserPresenceStatus;
  globalRole: GlobalRole;
  isProfilePublic: boolean;
  isBlocked?: boolean;
  blockedReason?: string | null;
  showOnlineStatus: boolean;
  lastSeenAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isEmailVerified: boolean;
  sessionVersion: number;

  hasCompletedOnboarding?: boolean;
  googleId?: string;
  authProviders?: {
    password: boolean;
    google: boolean;
  };
}

const userSchema = new Schema<IUserPersistence>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    status: {
      type: String,
      enum: Object.values(UserPresenceStatus),
      default: UserPresenceStatus.OFFLINE,
    },

    globalRole: {
      type: String,
      enum: Object.values(GlobalRole),
      default: GlobalRole.USER,
    },
    isProfilePublic: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: null },
    showOnlineStatus: { type: Boolean, default: true },
    lastSeenAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    sessionVersion: { type: Number, default: 1 },
    hasCompletedOnboarding: { type: Boolean, default: false },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    authProviders: {
      password: {
        type: Boolean,
        default: true,
      },
      google: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

export const UserModel = model<IUserPersistence>("User", userSchema);
