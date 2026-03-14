import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel, IUserPersistence } from "../database/UserModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";
import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { ConflictError } from "../../../domain/auth/errors/ConflictError";

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

  async delete(id: string, session?: ClientSession): Promise<boolean> {
    await this.updateRaw(id, { $set: { deletedAt: new Date() } }, session);
    return true;
  }

  //Handle soft deleted users when they try to register again
  async create(entity: User, session?: ClientSession): Promise<User> {
    const existingDeletedUser = await this.model
      .findOne({
        email: entity.email,
        deletedAt: { $ne: null },
      })
      .session(session || null);

    //Give them a fresh start
    if (existingDeletedUser) {
      // Log for audit (optional) usig logger

      const persistence = this.mapper.toPersistence(entity);
      const created = await this.createRaw(persistence, session);
      return this.mapper.toDomain(created);
    }

    // Check if email already exists and is NOT deleted (active user)
    const existingActiveUser = await this.model
      .findOne({
        email: entity.email,
        deletedAt: null,
      })
      .session(session || null);

    if (existingActiveUser) {
      throw new ConflictError();
    }

    // No existing user found, create new one
    const persistence = this.mapper.toPersistence(entity);
    const created = await this.createRaw(persistence, session);
    return this.mapper.toDomain(created);
  }

  //This is Hard deleted method created for future use (may be not use)
  async permanentDelete(id: string, session?: ClientSession): Promise<boolean> {
    await this.deleteRaw(id, session);
    return true;
  }
}
