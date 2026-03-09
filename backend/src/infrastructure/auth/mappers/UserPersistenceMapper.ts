import { User } from "../../../domain/auth/entities/User";
import { IUserPersistence } from "../database/UserModel";

export class UserPersistenceMapper {
    static toDomain(doc: IUserPersistence): User {
        return new User({
            id: doc._id?.toString(),
            username: doc.username,
            email: doc.email,
            passwordHash: doc.passwordHash,
            avatar: doc.avatar,
            status: doc.status,
            globalRole: doc.globalRole,
            isProfilePublic: doc.isProfilePublic,
            isBlocked: doc.isBlocked,
            blockedReason: doc.blockedReason,
            lastSeenAt: doc.lastSeenAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            deletedAt: doc.deletedAt,
            isEmailVerified : doc.isEmailVerified,
        });
    }

    static toPersistence(user: User): Omit<IUserPersistence, "_id"> {
        return {
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            avatar: user.avatar ?? "",
            status: user.status,
            globalRole: user.globalRole,
            isProfilePublic: user.isProfilePublic,
            isBlocked: user.isBlocked,
            blockedReason: user.blockedReason ?? undefined,
            lastSeenAt: user.lastSeenAt ?? undefined,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt,
            deletedAt: user.deletedAt ?? undefined,
            isEmailVerified: user.isEmailVerified,
        } 
    }

    static toPersistenceUpdate(data : Partial<User>) : Partial<IUserPersistence> {
        return {
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
            avatar: data.avatar,
            status: data.status,
            globalRole: data.globalRole,
            isProfilePublic: data.isProfilePublic,
            isBlocked: data.isBlocked,
            blockedReason: data.blockedReason ?? undefined,
            lastSeenAt: data.lastSeenAt ?? undefined,
            deletedAt: data.deletedAt ?? undefined,
            isEmailVerified: data.isEmailVerified,
        };
    }
}