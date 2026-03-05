import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel, IUserPersistence } from "../database/UserModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";
import { injectable } from "inversify";

@injectable()

export class UserRepository extends BaseRepository<IUserPersistence> implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.findByIdRaw(id);
    return doc ? UserPersistenceMapper.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.findOneRaw({email});
    return doc ? UserPersistenceMapper.toDomain(doc) : null;
  }

  async create(user : User) : Promise<User> {
    const persistence = UserPersistenceMapper.toPersistence(user);
    const created = await this.createRaw(persistence);
    return UserPersistenceMapper.toDomain(created);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const persistenceUpdate = UserPersistenceMapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, {$set : persistenceUpdate});
    return updated ? UserPersistenceMapper.toDomain(updated) : null;
  }

  async delete(id : string) : Promise<boolean> {
    await this.deleteRaw(id);
    return true;
  }
}
