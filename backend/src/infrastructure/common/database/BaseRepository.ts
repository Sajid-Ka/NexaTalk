import { Model, Types } from "mongoose";

export abstract class BaseRepository<TPersistence> {
  protected constructor(
    protected readonly model: Model<TPersistence>
  ) {}

  protected async findByIdRaw(id: string): Promise<TPersistence | null> {
    const entity = await this.model
      .findById(new Types.ObjectId(id))
      .lean();

    return entity as TPersistence | null;
  }

  protected async createRaw(
    data: Partial<TPersistence>
  ): Promise<TPersistence> {
    const created = await this.model.create(data);
    return created.toObject() as TPersistence;
  }

  protected async updateRaw(
    id: string,
    data: Partial<TPersistence>
  ): Promise<TPersistence | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean();

    return updated as TPersistence | null;
  }

  protected async deleteRaw(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}