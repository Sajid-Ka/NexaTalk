import { injectable } from "inversify";
import { ClientSession } from "mongoose";
import { User } from "../../../../domain/features/auth/entities/User";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { AdminUserQuery } from "../../../../domain/features/admin/types/AdminUserQuery";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { UserModel, IUserPersistence } from "../../auth/models/UserModel";
import { UserPersistenceMapper } from "../../auth/mappers/UserPersistenceMapper";
import { MongoQueryBuilder } from "../../../core/common/database/MongoQueryBuilder";

@injectable()
export class AdminUserRepository
  extends BaseRepository<IUserPersistence, User>
  implements IAdminUserRepository
{
  constructor() {
    super(UserModel, new UserPersistenceMapper());
  }

  async findUsers(query: AdminUserQuery) {
    const builder = new MongoQueryBuilder(this.model);
    const { docs, total, page, limit } = await builder.build(query);

    return {
      users: docs.map((doc) => this.mapper.toDomain(doc)),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.findByIdRaw(id);
    if (!doc || doc.deletedAt) return null;
    return this.mapper.toDomain(doc);
  }

  async update(id: string, data: Partial<User>, session?: ClientSession): Promise<User | null> {
    return super.update(id, data, session);
  }
}
