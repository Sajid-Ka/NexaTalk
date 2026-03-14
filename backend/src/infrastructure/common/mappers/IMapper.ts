import { OmittedDatabaseFields } from "../../../shared/enums/database-field.enum";

export interface IMapper<TPersistence, TDomain> {
  toDomain(persistence: TPersistence): TDomain;
  toPersistence(domain: TDomain): Omit<TPersistence, OmittedDatabaseFields>;
  toPersistenceUpdate(partialDomain: Partial<TDomain>): Record<string, unknown>;
}
