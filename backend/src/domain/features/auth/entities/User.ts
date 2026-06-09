import { GlobalRole } from "../../../../shared/constants/userRole.const";
import { UserPresenceStatus } from "../../../../shared/constants/userPresenceStatus.const";
import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";
import { BadRequestError } from "../../../core/errors/BadRequestError";

export interface UserProps {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;

  avatar?: string;
  bio?: string;
  status?: UserPresenceStatus;
  globalRole?: GlobalRole;

  accountStatus?: UserAccountStatus;
  isProfilePublic?: boolean;
  blockedReason?: string | null;

  showOnlineStatus?: boolean;
  lastSeenAt?: Date | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  isEmailVerified?: boolean;
  sessionVersion?: number;
  hasCompletedOnboarding?: boolean;

  //in feature need to add other auths then this helpful
  authProviders?: {
    password: boolean;
    google: boolean;
  };

  googleId?: string;
}

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly passwordHash: string;

  public readonly avatar?: string;
  public readonly bio?: string;
  public readonly status: UserPresenceStatus;
  public readonly globalRole: GlobalRole;

  public readonly accountStatus: UserAccountStatus;
  public readonly isProfilePublic: boolean;
  public readonly blockedReason: string | null;

  public readonly showOnlineStatus: boolean;
  public readonly lastSeenAt: Date | null;
  public readonly deletedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly isEmailVerified: boolean;
  public readonly sessionVersion: number;
  public readonly hasCompletedOnboarding: boolean;

  public readonly authProviders: {
    password: boolean;
    google: boolean;
  };
  public readonly googleId?: string;

  constructor(props: UserProps) {
    if (!props.username || props.username.trim().length < 3)
      throw new BadRequestError("Username must be atleast 3 characters");
    if (!props.email || !props.email.includes("@"))
      throw new BadRequestError("Invalid email address");

    const requiresPassword = props.authProviders?.password ?? true;
    if (requiresPassword && !props.passwordHash) {
      throw new BadRequestError("Invalid password hash");
    }

    this.id = props.id!;
    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;

    this.authProviders = props.authProviders ?? {
      password: true,
      google: false,
    };
    this.googleId = props.googleId;

    this.avatar = props.avatar ?? "";
    this.bio = props.bio ?? "";
    this.status = props.status ?? UserPresenceStatus.OFFLINE;
    this.globalRole = props.globalRole ?? GlobalRole.USER;

    this.accountStatus = props.accountStatus ?? UserAccountStatus.ACTIVE;
    this.isProfilePublic = props.isProfilePublic ?? true;
    this.blockedReason = props.blockedReason ?? null;

    this.showOnlineStatus = props.showOnlineStatus ?? true;
    this.lastSeenAt = props.lastSeenAt ?? null;
    this.deletedAt = props.deletedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();

    this.isEmailVerified = props.isEmailVerified ?? false;
    this.sessionVersion = props.sessionVersion ?? 1;
    this.hasCompletedOnboarding = props.hasCompletedOnboarding ?? false;
  }
}
