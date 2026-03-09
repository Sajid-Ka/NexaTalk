export interface ITransactionManager {
    run<T>(operation : (session : unknown) => Promise<T>) : Promise<T>;
}