export const DatabaseField = {
  ID: "_id",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  DELETED_AT: "deletedAt",
} as const;

export type DatabaseField = (typeof DatabaseField)[keyof typeof DatabaseField];

// For Omit utility type
export type OmittedDatabaseFields = "_id" | "createdAt" | "updatedAt";
