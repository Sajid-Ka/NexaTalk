import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel, IUserPersistence } from "../database/UserModel";
import { BaseRepository } from "../../common/database/BaseRepository";
import { UserPersistenceMapper } from "../mappers/UserPersistenceMapper";
import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { ListUsersRequestQuery } from "../../../application/admin/dtos/request/ListUsersRequestQuery";
import { MongoQueryBuilder } from "../../common/database/MongoQueryBuilder";

@injectable()

export class UserRepository extends BaseRepository<IUserPersistence> implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.findByIdRaw(id);
    if(!doc || doc.deletedAt) return null;
    return UserPersistenceMapper.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.findOneRaw({email, deletedAt : null});
    return doc ? UserPersistenceMapper.toDomain(doc) : null;
  }

  async findUsers (query : ListUsersRequestQuery) {
    const builder = new MongoQueryBuilder(this.model);

    const {docs, total, page, limit} = await builder.build(query);

    return {
      users : docs.map(UserPersistenceMapper.toDomain),
      total,
      page,
      limit
    };
  }

  async create(user : User, session?: unknown) : Promise<User> {
    const mongoSession = session as ClientSession | undefined;
    const persistence = UserPersistenceMapper.toPersistence(user);
    const created = await this.createRaw(persistence,mongoSession);
    return UserPersistenceMapper.toDomain(created);
  }

  async update(id: string, data: Partial<User>, session?: unknown): Promise<User | null> {
    const mongoSession = session as ClientSession  | undefined;
    const persistenceUpdate = UserPersistenceMapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, {$set : persistenceUpdate},mongoSession);
    return updated ? UserPersistenceMapper.toDomain(updated) : null;
  }

  async delete(id : string, session?: unknown) : Promise<boolean> {
    const mongoSession = session as ClientSession | undefined;
    await this.updateRaw(
      id,
      {$set : {deletedAt : new Date()}},
      mongoSession
    );
    return true;
  }
}
