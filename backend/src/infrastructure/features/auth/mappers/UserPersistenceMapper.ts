import { User } from "../../../../domain/features/auth/entities/User";
import { IUserPersistence } from "../models/UserModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class UserPersistenceMapper implements IMapper<IUserPersistence, User> {
  toDomain(doc: IUserPersistence): User {
    return new User({
      id: doc._id?.toString(),
      username: doc.username,
      email: doc.email,
      passwordHash: doc.passwordHash,
      avatar: doc.avatar,
      bio: doc.bio,
      status: doc.status,
      globalRole: doc.globalRole,
      accountStatus: doc.isBlocked ? UserAccountStatus.BLOCKED : UserAccountStatus.ACTIVE,
      isProfilePublic: doc.isProfilePublic,
      blockedReason: doc.blockedReason,
      showOnlineStatus: doc.showOnlineStatus ?? true,
      lastSeenAt: doc.lastSeenAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
      isEmailVerified: doc.isEmailVerified,
      sessionVersion: doc.sessionVersion,
      hasCompletedOnboarding: doc.hasCompletedOnboarding ?? false,
    });
  }

  toPersistence(user: User): Omit<IUserPersistence, OmittedDatabaseFields> {
    return {
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      avatar: user.avatar ?? "",
      bio: user.bio ?? "",
      status: user.status,
      globalRole: user.globalRole,
      isProfilePublic: user.isProfilePublic,
      isBlocked: user.accountStatus === UserAccountStatus.BLOCKED,
      blockedReason: user.blockedReason ?? undefined,
      showOnlineStatus: user.showOnlineStatus,
      lastSeenAt: user.lastSeenAt ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
      isEmailVerified: user.isEmailVerified,
      sessionVersion: user.sessionVersion,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    };
  }

  toPersistenceUpdate(data: Partial<User>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (data.username !== undefined) update.username = data.username;
    if (data.email !== undefined) update.email = data.email;
    if (data.passwordHash !== undefined) update.passwordHash = data.passwordHash;
    if (data.avatar !== undefined) update.avatar = data.avatar;
    if (data.bio !== undefined) update.bio = data.bio;
    if (data.status !== undefined) update.status = data.status;
    if (data.globalRole !== undefined) update.globalRole = data.globalRole;
    if (data.accountStatus !== undefined)
      update.isBlocked = data.accountStatus === UserAccountStatus.BLOCKED;
    if (data.isProfilePublic !== undefined) update.isProfilePublic = data.isProfilePublic;
    if (data.blockedReason !== undefined) update.blockedReason = data.blockedReason;
    if (data.showOnlineStatus !== undefined) update.showOnlineStatus = data.showOnlineStatus;
    if (data.lastSeenAt !== undefined) update.lastSeenAt = data.lastSeenAt;
    if (data.deletedAt !== undefined) update.deletedAt = data.deletedAt;
    if (data.isEmailVerified !== undefined) update.isEmailVerified = data.isEmailVerified;
    if (data.sessionVersion !== undefined) update.sessionVersion = data.sessionVersion;
    if (data.hasCompletedOnboarding !== undefined)
      update.hasCompletedOnboarding = data.hasCompletedOnboarding;
    return update;
  }
}
