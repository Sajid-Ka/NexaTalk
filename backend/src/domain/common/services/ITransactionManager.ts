import { ClientSession } from "mongoose";

export interface ITransactionManager {
  run<T>(operation: (session: ClientSession) => Promise<T>): Promise<T>;
}
