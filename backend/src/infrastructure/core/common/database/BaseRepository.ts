import { Model, UpdateQuery, Types, HydratedDocument } from "mongoose";
import { IBaseRepository } from "../../../../domain/core/common/repositories/IBaseRepository";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { IMapper } from "../mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";
import { toMongoSession } from "./toMongoSession";

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

  async create(entity: TDomain, transaction?: TransactionContext): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const created = await this.createRaw(persistence, transaction);
    return this.mapper.toDomain(created);
  }

  async update(
    id: string,
    data: Partial<TDomain>,
    transaction?: TransactionContext,
  ): Promise<TDomain | null> {
    const persistenceUpdate = this.mapper.toPersistenceUpdate(data);
    const updated = await this.updateRaw(id, { $set: persistenceUpdate }, transaction);
    return updated ? this.mapper.toDomain(updated) : null;
  }

  async delete(id: string, transaction?: TransactionContext): Promise<boolean> {
    await this.deleteRaw(id, transaction);
    return true;
  }

  protected async findByIdRaw(
    id: string,
    transaction?: TransactionContext,
  ): Promise<TPersistence | null> {
    return this.model
      .findOne({ _id: new Types.ObjectId(id) } as Filter)
      .session(toMongoSession(transaction) ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async findOneRaw(
    filter: Filter,
    transaction?: TransactionContext,
  ): Promise<TPersistence | null> {
    return this.model
      .findOne(filter)
      .session(toMongoSession(transaction) ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async createRaw(
    data: Omit<TPersistence, OmittedDatabaseFields>,
    transaction?: TransactionContext,
  ): Promise<TPersistence> {
    const doc: HydratedDocument<TPersistence> = new this.model(data);
    await doc.save({ session: toMongoSession(transaction) });
    return doc.toObject();
  }

  protected async updateRaw(
    id: string,
    data: UpdateQuery<TPersistence>,
    transaction?: TransactionContext,
  ): Promise<TPersistence | null> {
    return this.model
      .findOneAndUpdate({ _id: new Types.ObjectId(id) } as Filter, data, {
        returnDocument: "after",
        session: toMongoSession(transaction),
      })
      .lean<TPersistence>()
      .exec();
  }

  protected async deleteRaw(id: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .deleteOne({ _id: new Types.ObjectId(id) } as Filter)
      .session(toMongoSession(transaction) ?? null)
      .exec();
  }
}
