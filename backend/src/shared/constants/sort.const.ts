export const SortField = {
  USERNAME: "username",
  EMAIL: "email",
  CREATED_AT: "createdAt",
  STATUS: "status",
} as const;

export type SortField = (typeof SortField)[keyof typeof SortField];

export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

// Helper type for MongoDB sort order
export type MongoSortOrder = 1 | -1;

export const sortOrderToMongo = (order?: SortOrder): MongoSortOrder | undefined => {
  if (order === SortOrder.ASC) return 1;
  if (order === SortOrder.DESC) return -1;
  return undefined;
};
