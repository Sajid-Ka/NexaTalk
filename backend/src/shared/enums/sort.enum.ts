export enum SortField {
  USERNAME = "username",
  EMAIL = "email",
  CREATED_AT = "createdAt",
  STATUS = "status",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

// Helper type for MongoDB sort order
export type MongoSortOrder = 1 | -1;

export const sortOrderToMongo = (order?: SortOrder): MongoSortOrder | undefined => {
  if (order === SortOrder.ASC) return 1;
  if (order === SortOrder.DESC) return -1;
  return undefined;
};
