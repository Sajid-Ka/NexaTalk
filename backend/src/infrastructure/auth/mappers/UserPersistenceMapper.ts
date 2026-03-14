import { User } from "../../../domain/auth/entities/User";
import { IUserPersistence } from "../database/UserModel";
import { IMapper } from "../../common/mappers/IMapper";
import { UserAccountStatus } from "../../../shared/enums/userAccountStatus.enum";
import { UserPresenceStatus } from "../../../shared/enums/userPresenceStatus.enum";
import { GlobalRole } from "../../../shared/enums/userRole.enum";
import { OmittedDatabaseFields } from "../../../shared/enums/database-field.enum";

export class UserPersistenceMapper implements IMapper<IUserPersistence, User> {
  toDomain(doc: IUserPersistence): User {
    return new User({
      id: doc._id?.toString(),
      username: doc.username,
      email: doc.email,
      passwordHash: doc.passwordHash,
      avatar: doc.avatar,
      status: doc.status as UserPresenceStatus,
      globalRole: doc.globalRole as GlobalRole,
      accountStatus: doc.isBlocked ? UserAccountStatus.BLOCKED : UserAccountStatus.ACTIVE,
      isProfilePublic: doc.isProfilePublic,
      blockedReason: doc.blockedReason,
      lastSeenAt: doc.lastSeenAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
      isEmailVerified: doc.isEmailVerified,
    });
  }

  toPersistence(user: User): Omit<IUserPersistence, OmittedDatabaseFields> {
    return {
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      avatar: user.avatar ?? "",
      status: user.status,
      globalRole: user.globalRole,
      isProfilePublic: user.isProfilePublic,
      isBlocked: user.accountStatus === UserAccountStatus.BLOCKED,
      blockedReason: user.blockedReason ?? undefined,
      lastSeenAt: user.lastSeenAt ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      isEmailVerified: user.isEmailVerified,
    };
  }

  toPersistenceUpdate(data: Partial<User>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (data.username !== undefined) update.username = data.username;
    if (data.email !== undefined) update.email = data.email;
    if (data.passwordHash !== undefined) update.passwordHash = data.passwordHash;
    if (data.avatar !== undefined) update.avatar = data.avatar;
    if (data.status !== undefined) update.status = data.status;
    if (data.globalRole !== undefined) update.globalRole = data.globalRole;
    if (data.accountStatus !== undefined)
      update.isBlocked = data.accountStatus === UserAccountStatus.BLOCKED;
    if (data.isProfilePublic !== undefined) update.isProfilePublic = data.isProfilePublic;
    if (data.blockedReason !== undefined) update.blockedReason = data.blockedReason;
    if (data.lastSeenAt !== undefined) update.lastSeenAt = data.lastSeenAt;
    if (data.deletedAt !== undefined) update.deletedAt = data.deletedAt;
    if (data.isEmailVerified !== undefined) update.isEmailVerified = data.isEmailVerified;
    return update;
  }
}
