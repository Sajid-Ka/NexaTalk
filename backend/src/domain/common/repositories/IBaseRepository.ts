import { ClientSession } from "mongoose";

export interface IBaseRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findOne(filter: Partial<TEntity>): Promise<TEntity | null>;
  create(entity: TEntity, session?: ClientSession): Promise<TEntity>;
  update(id: string, data: Partial<TEntity>, session?: ClientSession): Promise<TEntity | null>;
  delete(id: string, session?: ClientSession): Promise<boolean>;
}
