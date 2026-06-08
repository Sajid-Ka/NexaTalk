import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { User } from "../../../../domain/features/auth/entities/User";
import { UserModel, IUserPersistence } from "../models/UserModel";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";
import { injectable } from "inversify";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { toMongoSession } from "../../../core/common/database/toMongoSession";
import { ConflictError } from "../../../../domain/features/auth/errors/ConflictError";

@injectable()
export class UserRepository
  extends BaseRepository<IUserPersistence, User>
  implements IUserRepository
{
  constructor() {
    super(UserModel, new UserPersistenceMapper());
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.findByIdRaw(id);
    if (!doc || doc.deletedAt) return null;
    return this.mapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email, deletedAt: null } as Partial<User>);
  }

  async findByEmailIncludingDeleted(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email }).lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async delete(id: string, transaction?: TransactionContext): Promise<boolean> {
    await this.updateRaw(id, { $set: { deletedAt: new Date() } }, transaction);
    return true;
  }

  async search(query: string, limit: number = 10): Promise<User[]> {
    const regex = new RegExp(query, "i");

    const docs = await this.model
      .find({
        $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        deletedAt: null,
        isBlocked: false,
      })
      .limit(limit)
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async searchPublicProfiles(query: string, limit: number = 10): Promise<User[]> {
    const regex = new RegExp(query, "i");

    const docs = await this.model
      .find({
        $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
        deletedAt: null,
        isBlocked: false,
        isProfilePublic: true,
      })
      .limit(limit)
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByUsername(username: string): Promise<User | null> {
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const doc = await this.model
      .findOne({
        username: new RegExp(`^${escapedUsername}$`, "i"),
        deletedAt: null,
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByUsernameIncludingDeleted(username: string): Promise<User | null> {
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const doc = await this.model
      .findOne({
        username: new RegExp(`^${escapedUsername}$`, "i"),
      })
      .lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  //Handle soft deleted users when they try to register again
  async create(entity: User, transaction?: TransactionContext): Promise<User> {
    // Check if email already exists and is NOT deleted (active user)
    const existingActiveUser = await this.model
      .findOne({
        email: entity.email,
        deletedAt: null,
      })
      .session(toMongoSession(transaction) ?? null);

    if (existingActiveUser) {
      throw new ConflictError("EMAIL_ALREADY_REGISTERED", "Email already registered");
    }

    const existingUsername = await this.model
      .findOne({
        username: new RegExp(`^${entity.username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        deletedAt: null,
      })
      .session(toMongoSession(transaction) ?? null);

    if (existingUsername) {
      throw new ConflictError("USERNAME_ALREADY_TAKEN", "Username already taken");
    }

    // No existing active user found, create new one
    // Note: Soft deleted users with the same email/username won't conflict due to our partial indexes and queries
    const persistence = this.mapper.toPersistence(entity);
    const created = await this.createRaw(persistence, transaction);
    return this.mapper.toDomain(created);
  }

  //This is Hard deleted method created for future use (may be not use)
  async permanentDelete(id: string, transaction?: TransactionContext): Promise<boolean> {
    await this.deleteRaw(id, transaction);
    return true;
  }
}
