export type UserStatus = "online" | "idle" | "offline";
export type GlobalRole = "user" | "admin";

export interface UserProps {
  id: string;
  username: string;
  email: string;
  passwordHash: string;

  avatar?: string;
  status?: UserStatus;
  globalRole?: GlobalRole;

  isProfilePublic?: boolean;
  isBlocked?: boolean;
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

  constructor(props: UserProps) {
    this.id = props.id
    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;

    this.avatar = props.avatar;
    this.status = props.status ?? "offline";
    this.globalRole = props.globalRole ?? "user";

    this.isProfilePublic = props.isProfilePublic ?? true;
    this.isBlocked = props.isBlocked ?? false;
  }

}
