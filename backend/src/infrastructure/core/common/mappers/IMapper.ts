import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export interface IMapper<TPersistence, TDomain> {
  toDomain(persistence: TPersistence): TDomain;
  toPersistence(domain: TDomain): Omit<TPersistence, OmittedDatabaseFields>;
  toPersistenceUpdate(partialDomain: Partial<TDomain>): Record<string, unknown>;
}
