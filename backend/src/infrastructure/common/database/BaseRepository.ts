import { Model, ClientSession, UpdateQuery, Types, HydratedDocument } from "mongoose";
import { IBaseRepository } from "../../../domain/common/repositories/IBaseRepository";
import { IMapper } from "../mappers/IMapper";
import { OmittedDatabaseFields } from "../../../shared/enums/database-field.enum";

type Filter = Record<string, unknown>;

export abstract class BaseRepository<
  TPersistence extends { _id: Types.ObjectId },
  TDomain,
> implements IBaseRepository<TDomain> {
  constructor(
    protected readonly model: Model<TPersistence>,
    protected readonly mapper: IMapper<TPersistence, TDomain>,
  ) {}

  async findById(id: string): Promise<TDomain | null> {
    const doc = await this.findByIdRaw(id);
    if (!doc) return null;
    return this.mapper.toDomain(doc);
  }

  async findOne(filter: Partial<TDomain>): Promise<TDomain | null> {
    const doc = await this.findOneRaw(filter as Filter);
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async create(entity: TDomain, session?: ClientSession): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const created = await this.createRaw(persistence, session);
    return this.mapper.toDomain(created);
  }

  async update(
    id: string,
    data: Partial<TDomain>,
    session?: ClientSession,
  ): Promise<TDomain | null> {
    const persistenceUpdate = this.mapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, { $set: persistenceUpdate }, session);
    return updated ? this.mapper.toDomain(updated) : null;
  }

  async delete(id: string, session?: ClientSession): Promise<boolean> {
    await this.deleteRaw(id, session);
    return true;
  }

  protected async findByIdRaw(id: string, session?: ClientSession): Promise<TPersistence | null> {
    return this.model
      .findOne({ _id: new Types.ObjectId(id) } as Filter)
      .session(session ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async findOneRaw(
    filter: Filter,
    session?: ClientSession,
  ): Promise<TPersistence | null> {
    return this.model
      .findOne(filter)
      .session(session ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async createRaw(
    data: Omit<TPersistence, OmittedDatabaseFields>,
    session?: ClientSession,
  ): Promise<TPersistence> {
    const doc: HydratedDocument<TPersistence> = new this.model(data);
    await doc.save({ session });
    return doc.toObject();
  }

  protected async updateRaw(
    id: string,
    data: UpdateQuery<TPersistence>,
    session?: ClientSession,
  ): Promise<TPersistence | null> {
    return this.model
      .findOneAndUpdate({ _id: new Types.ObjectId(id) } as Filter, data, {
        new: true,
        session,
      })
      .lean<TPersistence>()
      .exec();
  }

  protected async deleteRaw(id: string, session?: ClientSession): Promise<void> {
    await this.model
      .deleteOne({ _id: new Types.ObjectId(id) } as Filter)
      .session(session ?? null)
      .exec();
  }
}
