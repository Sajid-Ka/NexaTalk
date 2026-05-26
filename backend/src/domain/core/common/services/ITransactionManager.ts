import { TransactionContext } from "./TransactionContext";

export interface ITransactionManager {
  run<T>(operation: (transaction: TransactionContext) => Promise<T>): Promise<T>;
}
