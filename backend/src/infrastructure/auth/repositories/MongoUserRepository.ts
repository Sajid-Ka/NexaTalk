import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel, IUserDocument } from "../database/UserModel";
import { BaseRepository } from "../../common/database/BaseRepository";

export class MongoUserRepository extends BaseRepository<IUserDocument> implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({email}).lean();
    return doc ? this.toDomain(doc) : null;
  }

  async create(user : User) : Promise<User> {
    const persistance = this.toPersistence(user);
    const created = await this.createRaw(persistance);
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const updated = await this.updateRaw(id, data as any);
    return updated ? this.toDomain(updated) : null;
  }

  async delete(id : string) : Promise<boolean> {
    await this.deleteRaw(id);
    return true;
  }

  private toDomain(doc: IUserDocument): User {
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
      deletedAt: doc.deletedAt,
    });
  }

  private toPersistence(user : User) : Partial<IUserDocument> {
    return {
      username : user.username,
      email : user.email,
      passwordHash : user.passwordHash,
      avatar: user.avatar,
      status: user.status,
      globalRole: user.globalRole,
      isProfilePublic: user.isProfilePublic,
      isBlocked: user.isBlocked,
      blockedReason: user.blockedReason ?? undefined,
      lastSeenAt: user.lastSeenAt ?? undefined,
      deletedAt: user.deletedAt ?? undefined,
    }
  }
}
