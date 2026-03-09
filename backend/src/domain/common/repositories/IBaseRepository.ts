export interface IBaseRepository<TEntity> {
    findById(id : string) : Promise<TEntity | null>;
    create(entitiy : TEntity, session?: unknown) : Promise<TEntity>;
    update(id : string, data : Partial<TEntity>, session?: unknown) : Promise<TEntity | null>;
    delete(id : string) : Promise<boolean>;
}