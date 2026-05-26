import { TransactionContext } from "../services/TransactionContext";

export interface IBaseRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findOne(filter: Partial<TEntity>): Promise<TEntity | null>;
  create(entity: TEntity, transaction?: TransactionContext): Promise<TEntity>;
  update(
    id: string,
    data: Partial<TEntity>,
    transaction?: TransactionContext,
  ): Promise<TEntity | null>;
  delete(id: string, transaction?: TransactionContext): Promise<boolean>;
}
