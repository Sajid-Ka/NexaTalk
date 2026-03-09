import { GlobalRole,UserStatus } from "../../../shared/types/user.types";
import { BadRequestError } from "../../errors/BadRequestError";

export interface UserProps {
  id?: string;
  username: string;
  email: string;
  passwordHash: string;

  avatar?: string;
  status?: UserStatus;
  globalRole?: GlobalRole;

  isProfilePublic?: boolean;
  isBlocked?: boolean;
  blockedReason?: string | null;

  lastSeenAt?: Date | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  isEmailVerified?: boolean;
}

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly passwordHash: string;

  public readonly avatar?: string;
  public readonly status: UserStatus;
  public readonly globalRole: GlobalRole;

  public readonly isProfilePublic: boolean;
  public readonly isBlocked: boolean;
  public readonly blockedReason: string | null;

  public readonly lastSeenAt: Date | null;
  public readonly deletedAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly isEmailVerified : boolean;

  constructor(props: UserProps) {

    if(!props.username || props.username.trim().length < 3) throw new BadRequestError("Username must be atleast 3 characters");
    if(!props.email || !props.email.includes("@")) throw new BadRequestError("Invalid email address");
    if(!props.passwordHash) throw new BadRequestError("Invalid password hash"); 

    this.id = props.id!;
    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;

    this.avatar = props.avatar ?? "";
    this.status = props.status ?? "offline";
    this.globalRole = props.globalRole ?? "user";

    this.isProfilePublic = props.isProfilePublic ?? true;
    this.isBlocked = props.isBlocked ?? false;
    this.blockedReason = props.blockedReason ?? null;

    this.lastSeenAt = props.lastSeenAt ?? null;
    this.deletedAt = props.deletedAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();

    this.isEmailVerified = props.isEmailVerified ?? false;
  }
}
