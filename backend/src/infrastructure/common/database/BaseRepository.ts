import {
  Model,
  ClientSession,
  UpdateQuery,
  Types,
  HydratedDocument
} from "mongoose";

type Filter<T> = Record<string,unknown>;
type CreatePersistence<T> = Omit<T, "_id" | "createdAt" | "updatedAt">;

export abstract class BaseRepository<TPersistence extends {_id : Types.ObjectId }> {
  protected constructor(
    protected readonly model: Model<TPersistence>
  ) {}

  protected async findByIdRaw(
    id: string,
    session?: ClientSession
  ): Promise<TPersistence | null> {
    return this.model
      .findOne({ _id: new Types.ObjectId(id) } as Filter<TPersistence>)
      .session(session ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async findOneRaw(
    filter: Filter<TPersistence>,
    session?: ClientSession
  ): Promise<TPersistence | null> {
    return this.model
      .findOne(filter)
      .session(session ?? null)
      .lean<TPersistence>()
      .exec();
  }

  protected async createRaw(
    data: CreatePersistence<TPersistence>,
    session?: ClientSession
  ): Promise<TPersistence> {
    const doc : HydratedDocument<TPersistence> = new this.model(data);
    await doc.save({ session });
    return doc.toObject();
  }

  protected async updateRaw(
    id: string,
    data: UpdateQuery<TPersistence>,
    session?: ClientSession
  ): Promise<TPersistence | null> {
    return this.model
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id) } as Filter<TPersistence>,
        data,
        { new: true, session }
      )
      .lean<TPersistence>()
      .exec();
  }

  protected async deleteRaw(
    id: string,
    session?: ClientSession
  ): Promise<void> {
    await this.model
      .deleteOne({_id : new Types.ObjectId(id)} as Filter<TPersistence>)
      .session(session ?? null)
      .exec();
  }
}