export enum DatabaseField {
  ID = "_id",
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  DELETED_AT = "deletedAt",
}

// For Omit utility type
export type OmittedDatabaseFields = "_id" | "createdAt" | "updatedAt";
