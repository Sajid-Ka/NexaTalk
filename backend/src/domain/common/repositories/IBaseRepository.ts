export interface IBaseRepository<TEntity> {
    findById(id : string) : Promise<TEntity | null>;
    create(entitiy : TEntity) : Promise<TEntity>;
    update(id : string, data : Partial<TEntity>) : Promise<TEntity | null>;
    delete(id : string) : Promise<boolean>;
}