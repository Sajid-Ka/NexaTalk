import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel } from "../database/UserModel";
import { HydratedDocument } from "mongoose";
import { IUserDocument } from "../database/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });

    if (!userDoc) return null;

    return this.toEntity(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);

    if (!userDoc) return null;

    return this.toEntity(userDoc);
  }

  private toEntity(userDoc: HydratedDocument<IUserDocument>): User {
    return new User({
      id: userDoc.id,
      username: userDoc.username,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      avatar: userDoc.avatar,
      status: userDoc.status,
      globalRole: userDoc.globalRole,
      isProfilePublic: userDoc.isProfilePublic,
      isBlocked: userDoc.isBlocked,
      blockedReason: userDoc.blockedReason,
      lastSeenAt: userDoc.lastSeenAt,
      deletedAt: userDoc.deletedAt,
    });
  }

  async create(data: { username: string; email: string; passwordHash: string }): Promise<User> {
    const created = await UserModel.create(data);

    return this.toEntity(created);
  }
}
